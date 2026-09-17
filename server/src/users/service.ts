import Membership from "../models/membership.js";

export const getUsers = async (tenantId: string) => {
  const memberships = await Membership.find({
    tenant: tenantId,
    isActive: true,
  })
    .populate("user", "name email isActive")
    .sort({ createdAt: -1 })
    .lean();

  return memberships
    .filter((membership) => membership.user)
    .map((membership) => {
      const user = membership.user as unknown as {
        _id: string;
        name: string;
        email: string;
        isActive: boolean;
      };

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: membership.role,
      };
    });
};