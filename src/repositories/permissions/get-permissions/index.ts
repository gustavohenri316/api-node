import { ObjectId } from "mongodb";
import { MongoClient } from "../../../database/mongo";

import { User } from "../../../models/users";
import isValidObjectId from "bson-objectid";
import { IGetPermissionsRepository } from "../../../controllers/permissions/get-permissions";
import { Permission } from "../../../models/permissions";

export class MongoGetPermissionRepository implements IGetPermissionsRepository {
  async getPermissions(
    page: number,
    itemsPerPage: number,
    search?: string
  ): Promise<{ Permissions: Permission[]; totalItems: number }> {
    const skip = (page - 1) * itemsPerPage;
    const query: {
      [key: string]: RegExp;
    }[] = [];

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.push(
        { title: searchRegex },
        { description: searchRegex },
        { createdBy: searchRegex }
      );
    } else {
      query.push({});
    }

    const collection = MongoClient.db.collection<Permission>("permissions");
    const totalItems = await collection.countDocuments({ $or: query });
    const PermissionsCursor = collection
      .find({ $or: query })
      .skip(skip)
      .limit(itemsPerPage);

    const PermissionsWithUserInfo = await PermissionsCursor.toArray();

    const PermissionsWithoutId = PermissionsWithUserInfo.map((Permission) => {
      const { _id, ...rest } = Permission;
      return { ...rest, id: _id.toHexString() };
    });

    for (let i = 0; i < PermissionsWithoutId.length; i++) {
      const Permission = PermissionsWithoutId[i];
      if (isValidObjectId(Permission.createdBy as unknown as string)) {
        const userInfo = await this.getUserInfo(
          Permission.createdBy as unknown as string
        );

        const createdBy: {
          firstName: string;
          lastName: string;
          email: string;
        } = userInfo || { firstName: "", lastName: "", email: "" };

        PermissionsWithoutId[i].createdBy = createdBy;
      } else {
        console.error("Invalid userId:", Permission.createdBy);
      }
    }

    return { Permissions: PermissionsWithoutId, totalItems };
  }

  async getPermissionById(PermissionId: string): Promise<Permission | null> {
    try {
      const Permission = await MongoClient.db
        .collection<Permission>("permissions")
        .findOne(
          { _id: new ObjectId(PermissionId) },
          { projection: { _id: 0 } }
        );

      console.log("Permission", Permission);

      if (Permission) {
        return { ...Permission, id: PermissionId };
      }

      return null;
    } catch (error) {
      throw new Error("Error fetching Permission by ID");
    }
  }

  async getUserInfo(
    userId: string
  ): Promise<{ firstName: string; lastName: string; email: string } | null> {
    try {
      if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
        return null;
      }
      const collection = MongoClient.db.collection<Omit<User, "id">>("users");
      const userInfo = await collection.findOne({ _id: new ObjectId(userId) });
      if (userInfo) {
        return {
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          email: userInfo.email,
        };
      }

      return null;
    } catch (error) {
      console.error("Error fetching user information by userId:", error);
      return null;
    }
  }
}
