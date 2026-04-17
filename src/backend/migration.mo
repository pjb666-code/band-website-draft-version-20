import BaseToCore "BaseToCore";
import OrderedMap "mo:base/OrderedMap";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Map "mo:core/Map";

module {
  // ── Shared custom types (duplicated from main.mo — cannot import main.mo) ──

  type Time = Int;

  type ExternalBlob = Blob;

  type AudioFile = {
    id : Text;
    title : Text;
    file : ExternalBlob;
    duration : Nat;
    trackNumber : Nat;
  };

  type ImageFile = {
    id : Text;
    file : ExternalBlob;
    isCover : Bool;
  };

  type StreamingPlatform = {
    platform : Text;
    platformLabel : Text;
    url : Text;
  };

  type MediaType = {
    #single;
    #album;
    #video;
    #youtube;
  };

  type MediaItem = {
    id : Text;
    title : Text;
    description : Text;
    mediaType : MediaType;
    audioFiles : [AudioFile];
    images : [ImageFile];
    youtubeUrl : ?Text;
    price : Nat;
    streamingPlatforms : [StreamingPlatform];
    createdAt : Time;
  };

  type ProductVariant = {
    id : Text;
    name : Text;
    price : Nat;
    stock : Nat;
  };

  type Product = {
    id : Text;
    name : Text;
    description : Text;
    images : [ExternalBlob];
    variants : [ProductVariant];
    isDigital : Bool;
    categories : [Text];
    createdAt : Time;
    order : Nat;
  };

  type Show = {
    id : Text;
    title : Text;
    date : Time;
    venue : Text;
    location : Text;
    ticketLink : Text;
    status : Text;
    flyer : ?ExternalBlob;
  };

  type Task = {
    id : Text;
    title : Text;
    description : Text;
    deadline : Time;
    assignedTo : [Text];
    status : { #todo; #inProgress; #completed };
  };

  type FileItem = {
    id : Text;
    name : Text;
    folder : Text;
    file : ExternalBlob;
  };

  type Message = {
    id : Text;
    sender : Text;
    content : Text;
    timestamp : Time;
    threadId : Text;
  };

  type CalendarEvent = {
    id : Text;
    title : Text;
    description : Text;
    date : Time;
    location : Text;
  };

  type ContactMessage = {
    id : Text;
    name : Text;
    email : Text;
    subject : Text;
    message : Text;
    timestamp : Time;
    read : Bool;
  };

  type UserProfile = {
    name : Text;
    email : Text;
  };

  // ── Old actor state shape (using mo:base OrderedMap) ──

  type OldStorageState = {
    var authorizedPrincipals : [Principal];
    var blobTodeletete : [Blob];
  };

  type OldActor = {
    accessControlState : BaseToCore.OldAccessControlState;
    storage : OldStorageState;
    var userProfiles : OrderedMap.Map<Principal, UserProfile>;
    var rateLimitMap : OrderedMap.Map<Principal, [Int]>;
    var mediaItems : OrderedMap.Map<Text, MediaItem>;
    var products : OrderedMap.Map<Text, Product>;
    var shows : OrderedMap.Map<Text, Show>;
    var tasks : OrderedMap.Map<Text, Task>;
    var files : OrderedMap.Map<Text, FileItem>;
    var messages : OrderedMap.Map<Text, Message>;
    var calendarEvents : OrderedMap.Map<Text, CalendarEvent>;
    var contactMessages : OrderedMap.Map<Text, ContactMessage>;
  };

  // ── New actor state shape (using mo:core Map) ──

  type NewActor = {
    accessControlState : BaseToCore.NewAccessControlState;
    var userProfiles : Map.Map<Principal, UserProfile>;
    var rateLimitMap : Map.Map<Principal, [Int]>;
    var mediaItems : Map.Map<Text, MediaItem>;
    var products : Map.Map<Text, Product>;
    var shows : Map.Map<Text, Show>;
    var tasks : Map.Map<Text, Task>;
    var files : Map.Map<Text, FileItem>;
    var messages : Map.Map<Text, Message>;
    var calendarEvents : Map.Map<Text, CalendarEvent>;
    var contactMessages : Map.Map<Text, ContactMessage>;
  };

  public func run(old : OldActor) : NewActor {
    {
      accessControlState = BaseToCore.migrateAccessControlState(old.accessControlState);
      var userProfiles = BaseToCore.migrateOrderedMap<Principal, UserProfile>(old.userProfiles);
      var rateLimitMap = BaseToCore.migrateOrderedMap<Principal, [Int]>(old.rateLimitMap);
      var mediaItems = BaseToCore.migrateOrderedMap<Text, MediaItem>(old.mediaItems);
      var products = BaseToCore.migrateOrderedMap<Text, Product>(old.products);
      var shows = BaseToCore.migrateOrderedMap<Text, Show>(old.shows);
      var tasks = BaseToCore.migrateOrderedMap<Text, Task>(old.tasks);
      var files = BaseToCore.migrateOrderedMap<Text, FileItem>(old.files);
      var messages = BaseToCore.migrateOrderedMap<Text, Message>(old.messages);
      var calendarEvents = BaseToCore.migrateOrderedMap<Text, CalendarEvent>(old.calendarEvents);
      var contactMessages = BaseToCore.migrateOrderedMap<Text, ContactMessage>(old.contactMessages);
    };
  };
};
