
export interface GempaItem {
  DateTime: string;
  Coordinates: string;
  Lintang: string;
  Bujur: string;
  Magnitude: string;
  Kedalaman: string;
  Wilayah: string;
  Potensi: string;
}

export interface GempaResponse {
  Infogempa: {
    gempa: GempaItem[];
  };
}

export interface AutoGempaResponse {
  Infogempa: {
    gempa: {
      Tanggal: string;
      Jam: string;
      DateTime: string;
      Coordinates: string;
      Lintang: string;
      Bujur: string;
      Magnitude: string;
      Kedalaman: string;
      Wilayah: string;
      Potensi: string;
      Dirasakan: string;
      Shakemap: string;
    };
  };
}
