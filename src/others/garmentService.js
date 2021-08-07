import { auth, db } from "./firebase";

export async function getClothes() {
  const clothes = [];

  await db
    .collection("clothes")
    .where("user", "==", auth.currentUser.email)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        clothes.push(doc.data());
      });
    });

  return clothes;
}
