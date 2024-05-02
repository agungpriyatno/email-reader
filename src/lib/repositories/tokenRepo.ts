import db from "../db";

const find = () => {
  return db.token.findUnique({ where: { id: "main-token" } });
};

const tokenRepo = {
  find,
};

export { tokenRepo };
