export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  console.log(file);
  if (!file) return callback(new Error('File empty'), false);

  const fileExpresion = file.mimetype.split('/')[1];

  const validExtensions = ['png', 'jpeg', 'jpg', 'gif'];

  callback(null, validExtensions.includes(fileExpresion));
};
