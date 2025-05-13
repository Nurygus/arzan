import pg from "@/config/db";

export async function getSubscriptionTypeId(type: string) {
  const { rows: list } = await pg.query<{ id: number }>(
    "SELECT id FROM tb_subscription_type WHERE type = $1",
    [type],
  );
  return list[0].id;
}

export async function verifyUser(id: number) {
  await pg.query("UPDATE tb_user_auth SET verify = true WHERE id = $1", [id]);
}

export async function passwordRecoverRequested(id: number) {
  const { rows: passwordRecoveryList } = await pg.query(
    "SELECT id FROM tb_password_recover WHERE user_auth_id = $1",
    [id],
  );
  return passwordRecoveryList.length > 0;
}

export async function recoverPassword(id: number) {
  await pg.query("INSERT INTO tb_password_recover(user_auth_id) VALUES($1)", [
    id,
  ]);
}

export async function removeRecoverPassword(id: number) {
  await pg.query("DELETE FROM tb_password_recover WHERE user_auth_id = $1", [
    id,
  ]);
}

export async function subscribeAsUser(id: number) {
  const subscriptionTypeId = await getSubscriptionTypeId("USER");
  return await pg.query(
    "INSERT INTO tb_user_subscription_type(user_auth_id, subscription_type_id) VALUES($1, $2)",
    [id, subscriptionTypeId],
  );
}
