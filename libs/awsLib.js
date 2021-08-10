import { Storage } from "aws-amplify";
global.Buffer = global.Buffer || require("buffer").Buffer;

export async function s3Upload(file) {
  const filename = `${Date.now()}-pastiche.jpg`;

  const buffer = Buffer.from(file, "base64");

  const result = await Storage.put(filename, buffer, {
    level: "protected",
  }).catch((err) => console.log("error: " + err));

  // return result.key;

  //     stored = await Storage.put(filename, buffer, {
  //       contentType: "image/jpeg",
  //       level: "protected",
  //     }).then((res) => {
  //       return res.key;
  //     });

  return result.key;
}
