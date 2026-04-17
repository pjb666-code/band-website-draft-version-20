import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import Storage "mo:caffeineai-object-storage/Storage";
import Stripe "mo:caffeineai-stripe/stripe";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Cycles "mo:core/Cycles";
import Runtime "mo:core/Runtime";



actor Oneiric {
  // ── Access control ──
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ── Storage ──
  include MixinObjectStorage();

  // ── User Profiles ──
  public type UserProfile = {
    name : Text;
    email : Text;
  };

  var userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    checkRateLimit(caller);
    validateMaxLen(profile.name, 200, "name");
    validateMaxLen(profile.email, 254, "email");
    userProfiles.add(caller, profile);
  };

  // ── Rate Limiting ──
  let RATE_LIMIT_WINDOW : Int = 60_000_000_000;
  let RATE_LIMIT_MAX_REQUESTS : Nat = 60;

  var rateLimitMap = Map.empty<Principal, [Int]>();

  func checkRateLimit(caller : Principal) {
    let now = Time.now();
    let windowStart = now - RATE_LIMIT_WINDOW;

    let timestamps = switch (rateLimitMap.get(caller)) {
      case null { [] };
      case (?ts) { ts };
    };

    let recentTimestamps = timestamps.filter(func(t : Int) : Bool { t > windowStart });

    if (recentTimestamps.size() >= RATE_LIMIT_MAX_REQUESTS) {
      Runtime.trap("Too many requests – rate limit exceeded.");
    };

    let newTimestamps = recentTimestamps.concat([now]);
    rateLimitMap.add(caller, newTimestamps);
  };

  // ── Input Validation Helpers ──
  func validateMaxLen(value : Text, maxLen : Nat, fieldName : Text) {
    if (value.size() > maxLen) {
      Runtime.trap("Validation error: " # fieldName # " exceeds maximum length of " # maxLen.toText() # " characters");
    };
  };

  func validateNotEmpty(value : Text, fieldName : Text) {
    if (value.size() == 0) {
      Runtime.trap("Validation error: " # fieldName # " must not be empty");
    };
  };

  func validateArrayMaxLen<T>(arr : [T], maxLen : Nat, fieldName : Text) {
    if (arr.size() > maxLen) {
      Runtime.trap("Validation error: " # fieldName # " exceeds maximum of " # maxLen.toText() # " items");
    };
  };

  // ── Design Management ──
  public type ButtonStyle = {
    backgroundColor : Text;
    textColor : Text;
    borderColor : Text;
    borderRadius : Nat;
    borderWidth : Nat;
    borderStyle : Text;
    hoverBackgroundColor : Text;
    hoverTextColor : Text;
    hoverBorderColor : Text;
    shape : Text;
    size : Nat;
  };

  public type LogoVisibility = {
    header : Bool;
    hero : Bool;
  };

  public type QuickButton = {
    id : Text;
    buttonLabel : Text;
    url : Text;
    icon : Text;
    enabled : Bool;
    order : Nat;
    size : Nat;
  };

  public type HeroMediaType = {
    #image;
    #video;
  };

  public type HeroVideo = {
    file : ?Storage.ExternalBlob;
    externalUrl : ?Text;
    autoplay : Bool;
    shouldLoop : Bool;
    muted : Bool;
  };

  public type DesignConfig = {
    logo : ?Storage.ExternalBlob;
    heroImage : ?Storage.ExternalBlob;
    tagline : Text;
    accentColor : Text;
    heroTextColor : Text;
    heroTextSize : Nat;
    logoSize : Nat;
    buttonStyle : ButtonStyle;
    logoVisibility : LogoVisibility;
    quickButtons : [QuickButton];
    heroSubtitle : Text;
    hoverOutlineColor : Text;
    heroMediaType : HeroMediaType;
    heroVideo : ?HeroVideo;
  };

  var designConfig : DesignConfig = {
    logo = null;
    heroImage = null;
    tagline = "";
    accentColor = "#8b5cf6";
    heroTextColor = "#FFFFFF";
    heroTextSize = 48;
    logoSize = 100;
    buttonStyle = {
      backgroundColor = "#8b5cf6";
      textColor = "#FFFFFF";
      borderColor = "#8b5cf6";
      borderRadius = 8;
      borderWidth = 2;
      borderStyle = "solid";
      hoverBackgroundColor = "#7c3aed";
      hoverTextColor = "#FFFFFF";
      hoverBorderColor = "#7c3aed";
      shape = "rounded";
      size = 48;
    };
    logoVisibility = {
      header = true;
      hero = true;
    };
    quickButtons = [];
    heroSubtitle = "";
    hoverOutlineColor = "#8b5cf6";
    heroMediaType = #image;
    heroVideo = null;
  };

  public query func getDesignConfig() : async DesignConfig {
    designConfig;
  };

  public shared ({ caller }) func updateDesignConfig(config : DesignConfig) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update design config");
    };
    checkRateLimit(caller);
    validateMaxLen(config.tagline, 500, "tagline");
    validateMaxLen(config.accentColor, 20, "accentColor");
    validateMaxLen(config.heroTextColor, 20, "heroTextColor");
    validateMaxLen(config.heroSubtitle, 500, "heroSubtitle");
    validateMaxLen(config.hoverOutlineColor, 20, "hoverOutlineColor");
    validateMaxLen(config.buttonStyle.backgroundColor, 20, "buttonStyle.backgroundColor");
    validateMaxLen(config.buttonStyle.textColor, 20, "buttonStyle.textColor");
    validateMaxLen(config.buttonStyle.borderColor, 20, "buttonStyle.borderColor");
    validateMaxLen(config.buttonStyle.borderStyle, 50, "buttonStyle.borderStyle");
    validateMaxLen(config.buttonStyle.hoverBackgroundColor, 20, "buttonStyle.hoverBackgroundColor");
    validateMaxLen(config.buttonStyle.hoverTextColor, 20, "buttonStyle.hoverTextColor");
    validateMaxLen(config.buttonStyle.hoverBorderColor, 20, "buttonStyle.hoverBorderColor");
    validateMaxLen(config.buttonStyle.shape, 50, "buttonStyle.shape");
    validateArrayMaxLen(config.quickButtons, 10, "quickButtons");
    for (btn in config.quickButtons.values()) {
      validateMaxLen(btn.buttonLabel, 200, "quickButton.buttonLabel");
      validateMaxLen(btn.url, 2000, "quickButton.url");
      validateMaxLen(btn.icon, 100, "quickButton.icon");
    };
    designConfig := config;
  };

  // ── Enhanced Media Management ──
  public type MediaType = {
    #single;
    #album;
    #video;
    #youtube;
  };

  public type AudioFile = {
    id : Text;
    title : Text;
    file : Storage.ExternalBlob;
    duration : Nat;
    trackNumber : Nat;
  };

  public type ImageFile = {
    id : Text;
    file : Storage.ExternalBlob;
    isCover : Bool;
  };

  public type StreamingPlatform = {
    platform : Text;
    platformLabel : Text;
    url : Text;
  };

  public type MediaItem = {
    id : Text;
    title : Text;
    description : Text;
    mediaType : MediaType;
    audioFiles : [AudioFile];
    images : [ImageFile];
    youtubeUrl : ?Text;
    price : Nat;
    streamingPlatforms : [StreamingPlatform];
    createdAt : Time.Time;
  };

  var mediaItems = Map.empty<Text, MediaItem>();

  public query func getMediaItems() : async [MediaItem] {
    mediaItems.values().toArray();
  };

  public shared ({ caller }) func addMediaItem(item : MediaItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add media items");
    };
    checkRateLimit(caller);
    if (mediaItems.size() >= 200) {
      Runtime.trap("Validation error: mediaItems exceeds maximum of 200 items");
    };
    validateNotEmpty(item.title, "title");
    validateMaxLen(item.title, 200, "title");
    validateMaxLen(item.description, 10000, "description");
    for (af in item.audioFiles.values()) {
      validateMaxLen(af.title, 200, "audioFile.title");
    };
    for (sp in item.streamingPlatforms.values()) {
      validateMaxLen(sp.platform, 100, "streamingPlatform.platform");
      validateMaxLen(sp.url, 2000, "streamingPlatform.url");
    };
    switch (item.youtubeUrl) {
      case (?url) { validateMaxLen(url, 2000, "youtubeUrl") };
      case null {};
    };
    mediaItems.add(item.id, item);
  };

  public shared ({ caller }) func updateMediaItem(item : MediaItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update media items");
    };
    checkRateLimit(caller);
    validateNotEmpty(item.title, "title");
    validateMaxLen(item.title, 200, "title");
    validateMaxLen(item.description, 10000, "description");
    for (af in item.audioFiles.values()) {
      validateMaxLen(af.title, 200, "audioFile.title");
    };
    for (sp in item.streamingPlatforms.values()) {
      validateMaxLen(sp.platform, 100, "streamingPlatform.platform");
      validateMaxLen(sp.url, 2000, "streamingPlatform.url");
    };
    switch (item.youtubeUrl) {
      case (?url) { validateMaxLen(url, 2000, "youtubeUrl") };
      case null {};
    };
    mediaItems.add(item.id, item);
  };

  public shared ({ caller }) func deleteMediaItem(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete media items");
    };
    checkRateLimit(caller);
    mediaItems.remove(id);
  };

  // ── Shop Management ──
  public type ProductVariant = {
    id : Text;
    name : Text;
    price : Nat;
    stock : Nat;
  };

  public type Product = {
    id : Text;
    name : Text;
    description : Text;
    images : [Storage.ExternalBlob];
    variants : [ProductVariant];
    isDigital : Bool;
    categories : [Text];
    createdAt : Time.Time;
    order : Nat;
  };

  var products = Map.empty<Text, Product>();

  public query func getProducts() : async [Product] {
    products.values().toArray().sort(
      func(a : Product, b : Product) : { #less; #equal; #greater } {
        if (a.order < b.order) { #less } else if (a.order > b.order) { #greater } else {
          #equal;
        };
      }
    );
  };

  public shared ({ caller }) func addProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    checkRateLimit(caller);
    if (products.size() >= 500) {
      Runtime.trap("Validation error: products exceeds maximum of 500 items");
    };
    validateNotEmpty(product.name, "name");
    validateMaxLen(product.name, 200, "name");
    validateMaxLen(product.description, 10000, "description");
    for (v in product.variants.values()) {
      validateMaxLen(v.name, 200, "variant.name");
    };
    for (cat in product.categories.values()) {
      validateMaxLen(cat, 200, "category");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    checkRateLimit(caller);
    validateNotEmpty(product.name, "name");
    validateMaxLen(product.name, 200, "name");
    validateMaxLen(product.description, 10000, "description");
    for (v in product.variants.values()) {
      validateMaxLen(v.name, 200, "variant.name");
    };
    for (cat in product.categories.values()) {
      validateMaxLen(cat, 200, "category");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    checkRateLimit(caller);
    products.remove(id);
  };

  public shared ({ caller }) func updateProductOrder(productIds : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update product order");
    };
    checkRateLimit(caller);

    var index = 0;
    for (id in productIds.values()) {
      switch (products.get(id)) {
        case (?product) {
          products.add(id, { product with order = index });
        };
        case null {};
      };
      index += 1;
    };
  };

  // ── Stripe Integration ──
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set Stripe configuration");
    };
    checkRateLimit(caller);
    stripeConfig := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case null Runtime.trap("Stripe needs to be first configured");
      case (?value) value;
    };
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check session status");
    };
    checkRateLimit(caller);
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create checkout sessions");
    };
    checkRateLimit(caller);
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  // ── Content Management ──
  public type Show = {
    id : Text;
    title : Text;
    date : Time.Time;
    venue : Text;
    location : Text;
    ticketLink : Text;
    status : Text;
    flyer : ?Storage.ExternalBlob;
  };

  public type AboutContent = {
    biography : Text;
    pressKit : ?Storage.ExternalBlob;
    photos : [Storage.ExternalBlob];
    bandMembers : [Text];
  };

  public type LegalContent = {
    imprint : Text;
    privacyPolicy : Text;
    termsOfService : Text;
    lastUpdated : Time.Time;
  };

  public type HomepageConfig = {
    latestReleaseId : ?Text;
    featuredProductIds : [Text];
    upcomingShowIds : [Text];
    autoUpcomingShows : Bool;
  };

  var shows = Map.empty<Text, Show>();
  var aboutContent : AboutContent = {
    biography = "";
    pressKit = null;
    photos = [];
    bandMembers = [];
  };
  var legalContent : LegalContent = {
    imprint = "";
    privacyPolicy = "";
    termsOfService = "";
    lastUpdated = Time.now();
  };
  var homepageConfig : HomepageConfig = {
    latestReleaseId = null;
    featuredProductIds = [];
    upcomingShowIds = [];
    autoUpcomingShows = true;
  };

  public query func getShows() : async [Show] {
    shows.values().toArray();
  };

  public shared ({ caller }) func addShow(show : Show) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add shows");
    };
    checkRateLimit(caller);
    if (shows.size() >= 500) {
      Runtime.trap("Validation error: shows exceeds maximum of 500 items");
    };
    validateNotEmpty(show.title, "title");
    validateMaxLen(show.title, 200, "title");
    validateMaxLen(show.venue, 200, "venue");
    validateMaxLen(show.location, 200, "location");
    validateMaxLen(show.ticketLink, 2000, "ticketLink");
    validateMaxLen(show.status, 50, "status");
    shows.add(show.id, show);
  };

  public shared ({ caller }) func updateShow(show : Show) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update shows");
    };
    checkRateLimit(caller);
    validateNotEmpty(show.title, "title");
    validateMaxLen(show.title, 200, "title");
    validateMaxLen(show.venue, 200, "venue");
    validateMaxLen(show.location, 200, "location");
    validateMaxLen(show.ticketLink, 2000, "ticketLink");
    validateMaxLen(show.status, 50, "status");
    shows.add(show.id, show);
  };

  public shared ({ caller }) func deleteShow(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete shows");
    };
    checkRateLimit(caller);
    shows.remove(id);
  };

  public query func getAboutContent() : async AboutContent {
    aboutContent;
  };

  public shared ({ caller }) func updateAboutContent(content : AboutContent) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update about content");
    };
    checkRateLimit(caller);
    validateMaxLen(content.biography, 10000, "biography");
    validateArrayMaxLen(content.photos, 50, "photos");
    for (member in content.bandMembers.values()) {
      validateMaxLen(member, 200, "bandMember");
    };
    aboutContent := content;
  };

  public query func getLegalContent() : async LegalContent {
    legalContent;
  };

  public shared ({ caller }) func updateLegalContent(content : LegalContent) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update legal content");
    };
    checkRateLimit(caller);
    validateMaxLen(content.imprint, 10000, "imprint");
    validateMaxLen(content.privacyPolicy, 10000, "privacyPolicy");
    validateMaxLen(content.termsOfService, 10000, "termsOfService");
    legalContent := content;
  };

  public query func getHomepageConfig() : async HomepageConfig {
    homepageConfig;
  };

  public shared ({ caller }) func updateHomepageConfig(config : HomepageConfig) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update homepage config");
    };
    checkRateLimit(caller);
    validateArrayMaxLen(config.featuredProductIds, 20, "featuredProductIds");
    validateArrayMaxLen(config.upcomingShowIds, 20, "upcomingShowIds");
    homepageConfig := config;
  };

  // ── Band Organization ──
  public type TaskStatus = {
    #todo;
    #inProgress;
    #completed;
  };

  public type Task = {
    id : Text;
    title : Text;
    description : Text;
    deadline : Time.Time;
    assignedTo : [Text];
    status : TaskStatus;
  };

  public type FileItem = {
    id : Text;
    name : Text;
    folder : Text;
    file : Storage.ExternalBlob;
  };

  public type Message = {
    id : Text;
    sender : Text;
    content : Text;
    timestamp : Time.Time;
    threadId : Text;
  };

  public type CalendarEvent = {
    id : Text;
    title : Text;
    description : Text;
    date : Time.Time;
    location : Text;
  };

  var tasks = Map.empty<Text, Task>();
  var files = Map.empty<Text, FileItem>();
  var messages = Map.empty<Text, Message>();
  var calendarEvents = Map.empty<Text, CalendarEvent>();

  public query ({ caller }) func getTasks() : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view tasks");
    };
    tasks.values().toArray();
  };

  public shared ({ caller }) func addTask(task : Task) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add tasks");
    };
    checkRateLimit(caller);
    validateNotEmpty(task.title, "title");
    validateMaxLen(task.title, 200, "title");
    validateMaxLen(task.description, 10000, "description");
    tasks.add(task.id, task);
  };

  public shared ({ caller }) func updateTask(task : Task) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update tasks");
    };
    checkRateLimit(caller);
    validateNotEmpty(task.title, "title");
    validateMaxLen(task.title, 200, "title");
    validateMaxLen(task.description, 10000, "description");
    tasks.add(task.id, task);
  };

  public shared ({ caller }) func deleteTask(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete tasks");
    };
    checkRateLimit(caller);
    tasks.remove(id);
  };

  public query ({ caller }) func getFiles() : async [FileItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view files");
    };
    files.values().toArray();
  };

  public shared ({ caller }) func addFile(file : FileItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add files");
    };
    checkRateLimit(caller);
    files.add(file.id, file);
  };

  public shared ({ caller }) func deleteFile(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete files");
    };
    checkRateLimit(caller);
    files.remove(id);
  };

  public query ({ caller }) func getMessages() : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view messages");
    };
    messages.values().toArray();
  };

  public shared ({ caller }) func addMessage(message : Message) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add messages");
    };
    checkRateLimit(caller);
    validateNotEmpty(message.sender, "sender");
    validateMaxLen(message.sender, 200, "sender");
    validateNotEmpty(message.content, "content");
    validateMaxLen(message.content, 10000, "content");
    messages.add(message.id, message);
  };

  public query ({ caller }) func getCalendarEvents() : async [CalendarEvent] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view calendar events");
    };
    calendarEvents.values().toArray();
  };

  public shared ({ caller }) func addCalendarEvent(event : CalendarEvent) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add calendar events");
    };
    checkRateLimit(caller);
    validateNotEmpty(event.title, "title");
    validateMaxLen(event.title, 200, "title");
    validateMaxLen(event.description, 10000, "description");
    validateMaxLen(event.location, 200, "location");
    calendarEvents.add(event.id, event);
  };

  public shared ({ caller }) func updateCalendarEvent(event : CalendarEvent) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update calendar events");
    };
    checkRateLimit(caller);
    validateNotEmpty(event.title, "title");
    validateMaxLen(event.title, 200, "title");
    validateMaxLen(event.description, 10000, "description");
    validateMaxLen(event.location, 200, "location");
    calendarEvents.add(event.id, event);
  };

  public shared ({ caller }) func deleteCalendarEvent(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete calendar events");
    };
    checkRateLimit(caller);
    calendarEvents.remove(id);
  };

  // ── Social Media Links ──
  public type SocialMediaLink = {
    id : Text;
    platform : Text;
    url : Text;
    icon : Text;
    enabled : Bool;
    order : Nat;
  };

  var socialMediaLinks : [SocialMediaLink] = [];

  public query func getSocialMediaLinks() : async [SocialMediaLink] {
    socialMediaLinks;
  };

  public shared ({ caller }) func updateSocialMediaLinks(links : [SocialMediaLink]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update social media links");
    };
    checkRateLimit(caller);
    validateArrayMaxLen(links, 20, "socialMediaLinks");
    for (link in links.values()) {
      validateMaxLen(link.platform, 100, "socialMediaLink.platform");
      validateMaxLen(link.url, 2000, "socialMediaLink.url");
      validateMaxLen(link.icon, 100, "socialMediaLink.icon");
    };
    socialMediaLinks := links;
  };

  // ── Contact Page ──
  public type ContactMessage = {
    id : Text;
    name : Text;
    email : Text;
    subject : Text;
    message : Text;
    timestamp : Time.Time;
    read : Bool;
  };

  public type ContactConfig = {
    headline : Text;
    email : Text;
    socialMediaLinks : [SocialMediaLink];
  };

  var contactMessages = Map.empty<Text, ContactMessage>();
  var contactConfig : ContactConfig = {
    headline = "Contact Us";
    email = "contact@oneiric.com";
    socialMediaLinks = [];
  };

  public query ({ caller }) func getContactMessages() : async [ContactMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view contact messages");
    };
    contactMessages.values().toArray();
  };

  public shared ({ caller }) func addContactMessage(message : ContactMessage) : async () {
    // Public endpoint — rate limit to prevent spam
    checkRateLimit(caller);
    validateNotEmpty(message.name, "name");
    validateMaxLen(message.name, 200, "name");
    validateNotEmpty(message.email, "email");
    validateMaxLen(message.email, 254, "email");
    validateNotEmpty(message.subject, "subject");
    validateMaxLen(message.subject, 500, "subject");
    validateNotEmpty(message.message, "message");
    validateMaxLen(message.message, 5000, "message");
    contactMessages.add(message.id, message);
  };

  public shared ({ caller }) func markContactMessageAsRead(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can mark messages as read");
    };
    checkRateLimit(caller);
    switch (contactMessages.get(id)) {
      case (?message) {
        contactMessages.add(id, { message with read = true });
      };
      case null {};
    };
  };

  public query func getContactConfig() : async ContactConfig {
    contactConfig;
  };

  public shared ({ caller }) func updateContactConfig(config : ContactConfig) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update contact config");
    };
    checkRateLimit(caller);
    validateMaxLen(config.headline, 500, "headline");
    validateMaxLen(config.email, 254, "email");
    validateArrayMaxLen(config.socialMediaLinks, 20, "socialMediaLinks");
    for (link in config.socialMediaLinks.values()) {
      validateMaxLen(link.platform, 100, "socialMediaLink.platform");
      validateMaxLen(link.url, 2000, "socialMediaLink.url");
    };
    contactConfig := config;
  };

  // ── Booking Page ──
  public type BookingFile = {
    id : Text;
    name : Text;
    file : Storage.ExternalBlob;
    fileType : Text;
  };

  public type BookingLink = {
    id : Text;
    linkLabel : Text;
    url : Text;
    type_ : Text;
  };

  public type BookingConfig = {
    email : Text;
    callToAction : Text;
    files : [BookingFile];
    links : [BookingLink];
  };

  var bookingConfig : BookingConfig = {
    email = "booking@oneiric.com";
    callToAction = "Book Us Now";
    files = [];
    links = [];
  };

  public query func getBookingConfig() : async BookingConfig {
    bookingConfig;
  };

  public shared ({ caller }) func updateBookingConfig(config : BookingConfig) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update booking config");
    };
    checkRateLimit(caller);
    validateMaxLen(config.email, 254, "email");
    validateMaxLen(config.callToAction, 500, "callToAction");
    for (link in config.links.values()) {
      validateMaxLen(link.linkLabel, 200, "bookingLink.linkLabel");
      validateMaxLen(link.url, 2000, "bookingLink.url");
      validateMaxLen(link.type_, 50, "bookingLink.type_");
    };
    for (f in config.files.values()) {
      validateMaxLen(f.name, 200, "bookingFile.name");
      validateMaxLen(f.fileType, 100, "bookingFile.fileType");
    };
    bookingConfig := config;
  };

  // ── HTTP Outcalls ──
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public func makeGetOutcall(url : Text) : async Text {
    await OutCall.httpGetRequest(url, [], transform);
  };

  // ── Maintenance ──
  public type CanisterStatus = {
    canisterId : Text;
    cycles : Nat;
    memorySize : Nat;
    moduleHash : ?Blob;
    lastMaintenanceCheck : Time.Time;
    lastTopUpTime : ?Time.Time;
  };

  var lastMaintenanceCheck : Time.Time = Time.now();
  var lastTopUpTime : ?Time.Time = null;

  public shared ({ caller }) func getCanisterStatus() : async CanisterStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view canister status");
    };
    checkRateLimit(caller);
    lastMaintenanceCheck := Time.now();
    {
      canisterId = "vaxmx-pqaaa-aaaak-quqoq-cai";
      cycles = Cycles.balance();
      memorySize = 0;
      moduleHash = null;
      lastMaintenanceCheck;
      lastTopUpTime;
    };
  };

  public shared ({ caller }) func recordTopUp() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can record top-up events");
    };
    checkRateLimit(caller);
    lastTopUpTime := ?Time.now();
  };
};
