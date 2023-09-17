export const getProfilePhotoRootDir = () => {
  return __dirname + "/../uploads/images/profile/";
};

export const getUserIdProfilePhotoName = function (userId: string): string {
  return userId + ".jpg";
};

export const getUserIdProfilePhotoPath = function (userId: string): string {
  return getProfilePhotoRootDir() + getUserIdProfilePhotoName(userId);
};

export const getAttachmentRootDir = function (): string {
  return __dirname + "/../uploads/images/attachment/";
};

export const getAttachmentPhotoName = function (attachmentId: string): string {
  return attachmentId + ".jpg";
};

export const getAttachmentPath = function (attachmentId: string): string {
  return getAttachmentRootDir() + getAttachmentPhotoName(attachmentId);
};
