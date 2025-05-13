import pg from "@/config/db";

export async function listPages() {
  const { rows: list } = await pg.query("SELECT * FROM tb_page");
  return list;
}

export async function listPageNames() {
  const { rows: list } = await pg.query<string[]>(
    "SELECT array_agg(tb_page.name) FROM tb_page",
  );
  console.log(list);
  return list[0];
}
