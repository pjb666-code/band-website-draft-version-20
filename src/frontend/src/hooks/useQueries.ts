import { useActor } from "@caffeineai/core-infrastructure";
import { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  AboutContent,
  BookingConfig,
  CalendarEvent,
  CanisterStatus,
  ContactConfig,
  ContactMessage,
  DesignConfig,
  FileItem,
  HomepageConfig,
  LegalContent,
  MediaItem,
  Message,
  Product,
  ShoppingItem,
  Show,
  SocialMediaLink,
  StripeConfiguration,
  Task,
  UserProfile,
} from "../backend";

// Design Config
export function useGetDesignConfig() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<DesignConfig>({
    queryKey: ["designConfig"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getDesignConfig();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateDesignConfig() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: DesignConfig) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateDesignConfig(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designConfig"] });
    },
  });
}

// Homepage Config
export function useGetHomepageConfig() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<HomepageConfig>({
    queryKey: ["homepageConfig"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getHomepageConfig();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateHomepageConfig() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: HomepageConfig) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateHomepageConfig(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homepageConfig"] });
    },
  });
}

// Social Media Links
export function useGetSocialMediaLinks() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<SocialMediaLink[]>({
    queryKey: ["socialMediaLinks"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getSocialMediaLinks();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateSocialMediaLinks() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (links: SocialMediaLink[]) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateSocialMediaLinks(links);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socialMediaLinks"] });
    },
  });
}

// Contact Config
export function useGetContactConfig() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<ContactConfig>({
    queryKey: ["contactConfig"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getContactConfig();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateContactConfig() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: ContactConfig) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateContactConfig(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactConfig"] });
    },
  });
}

// Contact Messages
export function useGetContactMessages() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<ContactMessage[]>({
    queryKey: ["contactMessages"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getContactMessages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMarkContactMessageAsRead() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.markContactMessageAsRead(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactMessages"] });
    },
  });
}

// Booking Config
export function useGetBookingConfig() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<BookingConfig>({
    queryKey: ["bookingConfig"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getBookingConfig();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateBookingConfig() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: BookingConfig) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateBookingConfig(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookingConfig"] });
    },
  });
}

// Canister Status
export function useGetCanisterStatus() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<CanisterStatus>({
    queryKey: ["canisterStatus"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCanisterStatus();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnMount: "always",
  });
}

// Media Items
export function useGetMediaItems() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<MediaItem[]>({
    queryKey: ["mediaItems"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getMediaItems();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddMediaItem() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: MediaItem) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addMediaItem(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mediaItems"] });
    },
  });
}

export function useUpdateMediaItem() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: MediaItem) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateMediaItem(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mediaItems"] });
    },
  });
}

export function useDeleteMediaItem() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteMediaItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mediaItems"] });
    },
  });
}

// Products
export function useGetProducts() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getProducts();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddProduct() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProductOrder() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productIds: string[]) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateProductOrder(productIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// Shows
export function useGetShows() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Show[]>({
    queryKey: ["shows"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getShows();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddShow() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (show: Show) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addShow(show);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shows"] });
    },
  });
}

export function useUpdateShow() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (show: Show) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateShow(show);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shows"] });
    },
  });
}

export function useDeleteShow() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteShow(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shows"] });
    },
  });
}

// About Content
export function useGetAboutContent() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<AboutContent>({
    queryKey: ["aboutContent"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getAboutContent();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateAboutContent() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: AboutContent) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateAboutContent(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aboutContent"] });
    },
  });
}

// Legal Content
export function useGetLegalContent() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<LegalContent>({
    queryKey: ["legalContent"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getLegalContent();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateLegalContent() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: LegalContent) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateLegalContent(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["legalContent"] });
    },
  });
}

// Tasks
export function useGetTasks() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getTasks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddTask() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: Task) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addTask(task);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateTask() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: Task) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateTask(task);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useDeleteTask() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteTask(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

// Files
export function useGetFiles() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<FileItem[]>({
    queryKey: ["files"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getFiles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddFile() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: FileItem) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addFile(file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
}

export function useDeleteFile() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteFile(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
}

// Messages
export function useGetMessages() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Message[]>({
    queryKey: ["messages"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getMessages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddMessage() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message: Message) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addMessage(message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
}

// Calendar Events
export function useGetCalendarEvents() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<CalendarEvent[]>({
    queryKey: ["calendarEvents"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCalendarEvents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddCalendarEvent() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (event: CalendarEvent) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addCalendarEvent(event);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendarEvents"] });
    },
  });
}

export function useUpdateCalendarEvent() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (event: CalendarEvent) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateCalendarEvent(event);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendarEvents"] });
    },
  });
}

export function useDeleteCalendarEvent() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteCalendarEvent(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendarEvents"] });
    },
  });
}

// User Profile
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// Admin Check
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// Stripe
export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<boolean>({
    queryKey: ["stripeConfigured"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetStripeConfiguration() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: StripeConfiguration) => {
      if (!actor) throw new Error("Actor not available");
      return actor.setStripeConfiguration(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stripeConfigured"] });
    },
  });
}

export type CheckoutSession = {
  id: string;
  url: string;
};

export function useCreateCheckoutSession() {
  const { actor } = useActor(createActor);

  return useMutation({
    mutationFn: async (items: ShoppingItem[]): Promise<CheckoutSession> => {
      if (!actor) throw new Error("Actor not available");
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const successUrl = `${baseUrl}/payment-success`;
      const cancelUrl = `${baseUrl}/payment-failure`;
      const result = await actor.createCheckoutSession(
        items,
        successUrl,
        cancelUrl,
      );
      const session = JSON.parse(result) as CheckoutSession;
      return session;
    },
  });
}
