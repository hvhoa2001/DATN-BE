import { Request } from "express";
import {
  NFT,
  NFTContractService,
} from "../../middleware/Contract/crawlNFTData";
import { ShopContractService } from "../../middleware/Contract/crawlShopData";
import { INFTShop, NFTShopModel } from "../../models/NFTData/NFTShopSchema";
import { INFTData, NFTDataModel } from "../../models/NFTData/NFTDataSchema";
import { ExtendedRequest } from "../type";
import { delay } from "../../middleware/auth";

export async function crawlNFTData() {
  try {
    const nftContractService = new NFTContractService();
    const nfts = await nftContractService.getAllNFTs();

    if (!nfts || nfts.length === 0) {
      throw Error("No NFTs found");
    }

    for (const nft of nfts) {
      const existingProduct = await NFTDataModel.findOne({
        tokenId: nft.tokenId,
      });

      if (existingProduct) {
        console.info(`NFT with tokenId ${nft.tokenId} already exists`);
        continue;
      }

      const newNFTData: INFTData = new NFTDataModel({
        tokenId: nft.tokenId,
        name: nft.name,
        description: nft.description,
        size: nft.size,
        owner: nft.owner,
        image: nft.image,
      });

      try {
        await newNFTData.save();
        console.info(`NFT with tokenId ${nft.tokenId} saved successfully`);
      } catch (saveError) {
        console.error(
          `Error saving NFT with tokenId ${nft.tokenId}`,
          saveError
        );
      }
    }
  } catch (error) {
    console.error("🚀 ~ crawlNFTData ~ error:", error);
    throw Error("Crawling failed");
  }
}

export async function syncNFTsToProducts() {
  try {
    const nftContractService = new NFTContractService();
    const shopContractService = new ShopContractService();

    const nfts = await nftContractService.getAllNFTs();
    const listings = (await shopContractService.getAllListing()).filter(
      (listing) => listing != null
    );

    if (!nfts || nfts.length === 0) {
      throw Error("No NFTs found");
    }

    if (!listings || listings.length === 0) {
      throw Error("No listings found");
    }

    for (const listing of listings) {
      const nft = nfts.find((nft: NFT) => nft?.tokenId === listing?.tokenId);
      if (!nft) {
        console.warn(
          `No NFT found for listing with tokenId: ${listing.tokenId}`
        );
        continue;
      }

      const existingProduct = await NFTShopModel.findOne({
        tokenId: nft.tokenId,
      });
      if (existingProduct) {
        console.info(`Product with tokenId ${nft.tokenId} already exists`);
        continue;
      }

      const newProduct: INFTShop = new NFTShopModel({
        tokenId: nft.tokenId,
        name: nft.name,
        description: nft.description,
        price: listing.price,
        image: nft.image,
        sizes: nft.size,
      });

      try {
        await newProduct.save();
        console.info(`Product with tokenId ${nft.tokenId} saved successfully`);
      } catch (saveError) {
        console.error(
          `Error saving product for tokenId: ${nft.tokenId}`,
          saveError
        );
      }
    }
  } catch (error) {
    console.error("🚀 ~ syncNFTsToProducts ~ error:", error);
    throw Error("Sync failed");
  }
}

export async function BuyAndUpdate(req: Request) {
  try {
    await delay(10000);
    const { tokenId } = req.body;
    const shopContractService = new ShopContractService();
    const listings = (await shopContractService.getAllListing()).filter(
      (listing) => listing != null
    );

    const isTokenIdInListings = listings.some(
      (listing) => listing.tokenId === tokenId
    );

    if (!isTokenIdInListings) {
      const res = await NFTShopModel.deleteOne({ tokenId });
      return res;
    }
  } catch (error) {
    throw new Error("Failed to fetch grouped products");
  }
}

export async function getAllProducts(req: Request) {
  try {
    const products = await NFTShopModel.find();

    const groupedProducts = Object.values(
      products.reduce((acc, product) => {
        const { _id, name, sizes, description, price, image } = product;

        if (!acc[name]) {
          acc[name] = {
            productId: _id,
            name,
            description,
            price,
            image,
            sizes: [sizes],
          };
        } else {
          acc[name].sizes.push(sizes);
        }

        acc[name].sizes = [...new Set(acc[name].sizes)];

        return acc;
      }, {} as Record<string, any>)
    );

    return groupedProducts;
  } catch (error) {
    throw new Error("Failed to fetch grouped products");
  }
}

export async function getProductByName(req: Request) {
  try {
    const { name } = req.query;
    if (!name) {
      throw new Error("Product name is required");
    }

    const products = await NFTShopModel.find({ name }).lean();

    if (!products || products.length === 0) {
      throw new Error("Product not found");
    }

    const { _id, description, price, image } = products[0];

    const allSizes = products
      .flatMap((product) => product.sizes)
      .filter((size, index, self) => self.indexOf(size) === index);
    const productDetails = {
      productId: _id,
      name,
      description,
      price,
      image,
      sizes: allSizes,
    };

    return productDetails;
  } catch (error) {
    console.error("🚀 ~ getProductByName ~ error:", error);
    throw new Error("Failed to fetch product details");
  }
}

export async function getUserNFTs(req: ExtendedRequest) {
  const { userVerifiedData } = req;
  const res = await NFTDataModel.find({ owner: userVerifiedData?.userId });

  return res;
}

export async function getUserNFTDetails(req: ExtendedRequest) {
  const { tokenId } = req.query;
  const { userVerifiedData } = req;

  const res = await NFTDataModel.findOne({
    owner: userVerifiedData?.userId,
    tokenId: tokenId,
  });

  return res;
}
