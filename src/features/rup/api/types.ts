export interface RupApiResponse {
    kd_rup : string;
    nama_satker : string;
    nama_paket : string;
    pagu : number;
    metode_pengadaan : string;
    jenis_pengadaan : string;
    tahun_anggaran : number;
    kd_satker : string;
    status_rup : string;
}

export interface RupApiParams {
    tahun?: number;
    kd_satker?: string;
    tipe?: string;
}

export interface ApiError {
    message : string;
    status?: string;
}