import { Counter } from '../mongoose/modules/counter.js';

// generateSequence - raqamli ID yaratish funksiyasi
export async function generateSequence(collectionName) {
    const counter = await Counter.findByIdAndUpdate(
        { _id: collectionName },
        { $inc: { seq: 1 } },  // Sequence ni oshirish
        { new: true, upsert: true } // Agar mavjud bo'lmasa, yaratish
    );
    return counter.seq; // Yangi raqamni qaytarish
}
