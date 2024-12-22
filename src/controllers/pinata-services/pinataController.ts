import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import pinataSDK, { PinataPinOptions, PinataPinResponse } from "@pinata/sdk";

// Kết nối với Pinata
const pinata = new pinataSDK(
  process.env.PINATA_API_KEY!,
  process.env.PINATA_SECRET_KEY!
);

export const uploadFileToIPFS = async (req: Request, res: Response) => {
  try {
    // Kiểm tra file có được upload không
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Đọc file từ thư mục tạm
    const filePath = path.join(
      __dirname,
      "../../../public/upload",
      req.file.filename
    );
    const readableStream = fs.createReadStream(filePath);

    // Upload file lên Pinata
    const options = {
      pinataMetadata: {
        name: req.file.originalname,
      },
      pinataOptions: { cidVersion: 1 } as PinataPinOptions["pinataOptions"],
    };

    const response: PinataPinResponse = await pinata.pinFileToIPFS(
      readableStream,
      options
    );

    // Xoá file tạm sau khi upload thành công
    fs.unlinkSync(filePath);

    // Trả về CID của file
    return res.status(200).json({ cid: response.IpfsHash });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({ error: "Failed to upload file" });
  }
};
