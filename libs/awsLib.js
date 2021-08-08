import { Storage } from "aws-amplify";
global.Buffer = global.Buffer || require("buffer").Buffer;
// import("buffer").then(({ Buffer }) => {
//   global.Buffer = Buffer;
// });

export async function s3Upload(file) {
  try {
    const filename = `${Date.now()}-pastiche.jpg`;

    const buffer = Buffer.from(file, "base64");
    stored = await Storage.put(filename, buffer, {
      contentType: "image/jpeg",
      // level: "protected",
    }).then((res) => {
      console.log(res, "Upload result");
      return stored.key;
    });
  } catch (err) {
    console.log("error: " + err);
  }
}

// export async function s3Upload(file) {
//   const filename = `${Date.now()}-${file.name}`;

//   const stored = await Storage.vault.put(filename, file, {
//     contentType: file.type,
//   });

//   return stored.key;
// }

//   //   try {
//     const response = await fetch(file);
//     const blob = await response.blob();
//     stored = await Storage.put("test.jpg", blob, {
//       contentType: file.type,
//     }).then((res) => {
//       console.log(res, "Upload result");
//       return stored.key;
//     });

// async function pathToImageFile() {
//   try {
//     const response = await fetch(pathToImageFile);
//     const blob = await response.blob();
//     await Storage.put("yourKeyHere", blob, {
//       contentType: "image/jpeg", // contentType is optional
//     });
//   } catch (err) {
//     console.log("Error uploading file:", err);
//   }
// }
