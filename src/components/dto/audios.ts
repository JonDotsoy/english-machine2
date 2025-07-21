export interface AudiosDTO {
  audios_map?: Record<string, string>; // Optional: audio name to hash
  audios: Record<string, string>; // Required: audio name to base64 string
}
