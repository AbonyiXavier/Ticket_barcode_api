import logger from "../../config/logger";
import categoryModel from "../../models/category.model";

export const createCategory = async (name: string) => {

  try {
    const category = new categoryModel({
     name
    });

    const result = await category.save();
    
    return result;
  } catch (error: any) {
    logger.error("create category failed", error);
    throw error;
  }
};