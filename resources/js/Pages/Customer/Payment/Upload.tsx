import { useForm } from "@inertiajs/react";

interface UploadProps {
    pembayaran: {
        id_pembayaran: number;
        jenis_pembayaran: string;
        jumlah_bayar: number;
    };
}

export default function Upload({ pembayaran }: UploadProps) {

    const { data, setData, post, processing, errors } = useForm({
        bukti_bayar: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("customer.payment.upload.proof", pembayaran.id_pembayaran));
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold mb-4">Upload Bukti Pembayaran</h1>

            <form onSubmit={submit} className="space-y-4">

                <div>
                    <input
                        type="file"
                        accept="image/*"
                        className="w-full"
                        onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;
                            setData("bukti_bayar", file);
                        }}
                    />
                    {errors.bukti_bayar && (
                        <div className="text-red-500">{errors.bukti_bayar}</div>
                    )}
                </div>

                <button
                    disabled={processing}
                    className="w-full bg-green-600 text-white py-2 rounded-lg"
                >
                    Upload
                </button>
            </form>
        </div>
    );
}
