import express from "express";
import { upload } from "../../middleware/NFTs/pinataUpload";
import { uploadFileToIPFS } from "../../controllers/pinata-services/pinataController";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadFileToIPFS);

export { router as pinataRouter };
