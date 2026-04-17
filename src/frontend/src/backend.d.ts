import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface AboutContent {
    bandMembers: Array<string>;
    biography: string;
    pressKit?: ExternalBlob;
    photos: Array<ExternalBlob>;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface LegalContent {
    privacyPolicy: string;
    lastUpdated: Time;
    imprint: string;
    termsOfService: string;
}
export interface ImageFile {
    id: string;
    file: ExternalBlob;
    isCover: boolean;
}
export interface Task {
    id: string;
    status: TaskStatus;
    title: string;
    assignedTo: Array<string>;
    description: string;
    deadline: Time;
}
export interface SocialMediaLink {
    id: string;
    url: string;
    order: bigint;
    icon: string;
    platform: string;
    enabled: boolean;
}
export interface MediaItem {
    id: string;
    title: string;
    createdAt: Time;
    description: string;
    streamingPlatforms: Array<StreamingPlatform>;
    audioFiles: Array<AudioFile>;
    mediaType: MediaType;
    price: bigint;
    youtubeUrl?: string;
    images: Array<ImageFile>;
}
export interface HomepageConfig {
    autoUpcomingShows: boolean;
    latestReleaseId?: string;
    upcomingShowIds: Array<string>;
    featuredProductIds: Array<string>;
}
export interface ContactMessage {
    id: string;
    subject: string;
    name: string;
    read: boolean;
    email: string;
    message: string;
    timestamp: Time;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface DesignConfig {
    tagline: string;
    logo?: ExternalBlob;
    heroMediaType: HeroMediaType;
    heroSubtitle: string;
    accentColor: string;
    logoSize: bigint;
    heroImage?: ExternalBlob;
    logoVisibility: LogoVisibility;
    heroTextColor: string;
    heroTextSize: bigint;
    buttonStyle: ButtonStyle;
    quickButtons: Array<QuickButton>;
    heroVideo?: HeroVideo;
    hoverOutlineColor: string;
}
export interface StreamingPlatform {
    url: string;
    platformLabel: string;
    platform: string;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface BookingLink {
    id: string;
    url: string;
    linkLabel: string;
    type: string;
}
export interface FileItem {
    id: string;
    file: ExternalBlob;
    name: string;
    folder: string;
}
export interface ContactConfig {
    headline: string;
    email: string;
    socialMediaLinks: Array<SocialMediaLink>;
}
export interface QuickButton {
    id: string;
    url: string;
    order: bigint;
    icon: string;
    size: bigint;
    enabled: boolean;
    buttonLabel: string;
}
export interface BookingConfig {
    files: Array<BookingFile>;
    email: string;
    links: Array<BookingLink>;
    callToAction: string;
}
export interface LogoVisibility {
    hero: boolean;
    header: boolean;
}
export interface BookingFile {
    id: string;
    file: ExternalBlob;
    name: string;
    fileType: string;
}
export interface ProductVariant {
    id: string;
    name: string;
    stock: bigint;
    price: bigint;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ButtonStyle {
    backgroundColor: string;
    borderRadius: bigint;
    hoverBackgroundColor: string;
    borderStyle: string;
    size: bigint;
    borderWidth: bigint;
    shape: string;
    hoverTextColor: string;
    hoverBorderColor: string;
    borderColor: string;
    textColor: string;
}
export interface AudioFile {
    id: string;
    title: string;
    duration: bigint;
    file: ExternalBlob;
    trackNumber: bigint;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface CalendarEvent {
    id: string;
    title: string;
    date: Time;
    description: string;
    location: string;
}
export interface Show {
    id: string;
    flyer?: ExternalBlob;
    status: string;
    title: string;
    venue: string;
    date: Time;
    ticketLink: string;
    location: string;
}
export interface Message {
    id: string;
    content: string;
    sender: string;
    timestamp: Time;
    threadId: string;
}
export interface CanisterStatus {
    moduleHash?: Uint8Array;
    lastTopUpTime?: Time;
    cycles: bigint;
    memorySize: bigint;
    canisterId: string;
    lastMaintenanceCheck: Time;
}
export interface HeroVideo {
    muted: boolean;
    autoplay: boolean;
    file?: ExternalBlob;
    externalUrl?: string;
    shouldLoop: boolean;
}
export interface UserProfile {
    name: string;
    email: string;
}
export interface Product {
    id: string;
    categories: Array<string>;
    order: bigint;
    name: string;
    createdAt: Time;
    description: string;
    variants: Array<ProductVariant>;
    isDigital: boolean;
    images: Array<ExternalBlob>;
}
export enum HeroMediaType {
    video = "video",
    image = "image"
}
export enum MediaType {
    album = "album",
    video = "video",
    youtube = "youtube",
    single = "single"
}
export enum TaskStatus {
    todo = "todo",
    completed = "completed",
    inProgress = "inProgress"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCalendarEvent(event: CalendarEvent): Promise<void>;
    addContactMessage(message: ContactMessage): Promise<void>;
    addFile(file: FileItem): Promise<void>;
    addMediaItem(item: MediaItem): Promise<void>;
    addMessage(message: Message): Promise<void>;
    addProduct(product: Product): Promise<void>;
    addShow(show: Show): Promise<void>;
    addTask(task: Task): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    deleteCalendarEvent(id: string): Promise<void>;
    deleteFile(id: string): Promise<void>;
    deleteMediaItem(id: string): Promise<void>;
    deleteProduct(id: string): Promise<void>;
    deleteShow(id: string): Promise<void>;
    deleteTask(id: string): Promise<void>;
    getAboutContent(): Promise<AboutContent>;
    getBookingConfig(): Promise<BookingConfig>;
    getCalendarEvents(): Promise<Array<CalendarEvent>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCanisterStatus(): Promise<CanisterStatus>;
    getContactConfig(): Promise<ContactConfig>;
    getContactMessages(): Promise<Array<ContactMessage>>;
    getDesignConfig(): Promise<DesignConfig>;
    getFiles(): Promise<Array<FileItem>>;
    getHomepageConfig(): Promise<HomepageConfig>;
    getLegalContent(): Promise<LegalContent>;
    getMediaItems(): Promise<Array<MediaItem>>;
    getMessages(): Promise<Array<Message>>;
    getProducts(): Promise<Array<Product>>;
    getShows(): Promise<Array<Show>>;
    getSocialMediaLinks(): Promise<Array<SocialMediaLink>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getTasks(): Promise<Array<Task>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    makeGetOutcall(url: string): Promise<string>;
    markContactMessageAsRead(id: string): Promise<void>;
    recordTopUp(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateAboutContent(content: AboutContent): Promise<void>;
    updateBookingConfig(config: BookingConfig): Promise<void>;
    updateCalendarEvent(event: CalendarEvent): Promise<void>;
    updateContactConfig(config: ContactConfig): Promise<void>;
    updateDesignConfig(config: DesignConfig): Promise<void>;
    updateHomepageConfig(config: HomepageConfig): Promise<void>;
    updateLegalContent(content: LegalContent): Promise<void>;
    updateMediaItem(item: MediaItem): Promise<void>;
    updateProduct(product: Product): Promise<void>;
    updateProductOrder(productIds: Array<string>): Promise<void>;
    updateShow(show: Show): Promise<void>;
    updateSocialMediaLinks(links: Array<SocialMediaLink>): Promise<void>;
    updateTask(task: Task): Promise<void>;
}
