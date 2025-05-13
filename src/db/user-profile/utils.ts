import pg from "@/config/db";
import {
  UserDayStreakCoinRewardListRequest,
  UserDayStreakSetRequest,
  UserFollowRequest,
  UserProfileBackgroundImageAddRequest,
  UserProfileBackgroundImageDeleteRequest,
  UserProfileGetRequest,
  UserProfileListRequest,
  UserProfileSetAvatarRequest,
  UserProfileUpdateRequest,
  UserUnFollowRequest,
} from "@/types/request/user-profile";
import { ApiResponse } from "@/types/response";

export class UserProfileDB {
  async list(body: UserProfileListRequest): Promise<any[]> {
    const {
      query,
      subscription_type,
      subscription_type_id,
      location_id,
      limit,
      offset,
      sort,
      order,
    } = body;
    const subscriptionTypeFilter = subscription_type
      ? `tb_subscription_type.type = $3`
      : `$3`;
    const subscriptionTypeIdFilter = subscription_type_id
      ? `tb_subscription_type.id = $4`
      : `$4`;
    const locationIdFilter = location_id ? `tb_location.id = $5` : `$5`;
    const sqlquery = query ? "%" + query + "%" : null;
    const queryFilter = query ? `tb_user_auth.name ILIKE $6` : `$6`;

    let sortBy = `coin_balance`;
    switch (sort) {
      case "coin":
        sortBy = `coin_balance`;
        break;
      case "like":
        sortBy = `like_count`;
        break;
      case "view":
        sortBy = `view_count`;
        break;
      case "follower":
        sortBy = `follower_count`;
        break;
      case "following":
        sortBy = `following_count`;
        break;
      case "post":
        sortBy = `post_count`;
        break;
      case "video":
        sortBy = `video_count`;
        break;
      case "image":
        sortBy = `image_count`;
        break;
      case "gallery":
        sortBy = `gallery_count`;
        break;
      case "user_id":
        sortBy = `user_data.id`;
        break;
      case "user_name":
        sortBy = `user_data.name`;
        break;
      case "user_created_at":
        sortBy = `user_data.created_on`;
        break;
    }

    let orderBy = `DESC`;
    switch (order) {
      case "asc":
        orderBy = `ASC`;
        break;
      case "desc":
        orderBy = `DESC`;
        break;
    }
    const { rows: listLimit } = await pg.query(
      `SELECT
        *
      FROM
        tb_top_list_limit
      WHERE
        tb_top_list_limit.name = $1`,
      [sort || "coin"],
    );

    const listLimitCount =
      listLimit.length > 0 ? Number(listLimit[0].limit_count) : null;

    const userQuery = `WHERE ${subscriptionTypeFilter} AND ${subscriptionTypeIdFilter} AND ${locationIdFilter} AND ${queryFilter}`;
    const rLimit =
      listLimitCount !== null
        ? Math.min(limit || Infinity, listLimitCount)
        : limit;
    const _rlim = rLimit || 0;
    const _ofs = offset || 0;
    const rOffset =
      listLimitCount && _ofs + _rlim > listLimitCount
        ? Math.max(Math.min(listLimitCount - _rlim, _ofs), 0)
        : _ofs;

    const values = [
      rLimit,
      rOffset,
      subscription_type || `TRUE`,
      subscription_type_id || `TRUE`,
      location_id || `TRUE`,
      sqlquery || `TRUE`,
    ];

    const { rows: list } = await pg.query(
      `
      WITH user_data AS (
        SELECT
          DISTINCT tb_user_auth.id,
          tb_user_auth.name
        FROM
          tb_user_auth
          LEFT JOIN tb_user_subscription_type ON tb_user_subscription_type.user_auth_id = tb_user_auth.id
          LEFT JOIN tb_subscription_type ON tb_subscription_type.id = tb_user_subscription_type.subscription_type_id
          LEFT JOIN tb_user_location ON tb_user_location.user_auth_id = tb_user_auth.id
          LEFT JOIN tb_location ON tb_location.id = tb_user_location.location_id
        ${userQuery}
      ),
      user_avatar AS (
        SELECT
          tb_user_auth.id AS user_auth_id,
          jsonb_build_object('url', user_auth_avatar_image.url) AS avatar_image
        FROM
          tb_user_auth
          LEFT JOIN tb_user_auth_avatar_image ON tb_user_auth_avatar_image.user_auth_id = tb_user_auth.id
          LEFT JOIN tb_image AS user_auth_avatar_image ON user_auth_avatar_image.id = tb_user_auth_avatar_image.image_id
      ),
      follow AS (
        SELECT
          user_data.id as user_auth_id,
          tb_user_follower_statistic.follower_count AS follower_count,
          tb_user_follower_statistic.following_count AS following_count
        FROM
          user_data
          LEFT JOIN tb_user_follower_statistic ON tb_user_follower_statistic.user_auth_id = user_data.id
      ),
      coin_balance AS (
        SELECT
          user_data.id as user_auth_id,
          tb_user_coin_balance.balance AS balance
        FROM
          user_data
          LEFT JOIN tb_user_coin_balance ON tb_user_coin_balance.user_auth_id = user_data.id
      ),
      gallery AS (
        SELECT
          user_data.id as user_auth_id,
          CAST(COALESCE(COUNT(DISTINCT tb_gallery.id), '0') as INTEGER) AS gallery_count
        FROM
          user_data
          LEFT JOIN tb_gallery ON tb_gallery.user_auth_id = user_data.id
        GROUP BY
          user_data.id
      ),
      image AS (
        SELECT
          user_data.id as user_auth_id,
          tb_user_image.id AS id,
          tb_user_image.viewed_count AS view_count,
          tb_user_image_like_statistic.like_count as like_count
        FROM
          user_data
          LEFT JOIN tb_user_image ON tb_user_image.user_auth_id = user_data.id
          LEFT JOIN tb_user_image_like_statistic ON tb_user_image_like_statistic.user_image_id = tb_user_image.id
      ),
      video AS (
        SELECT
          user_data.id as user_auth_id,
          tb_user_video.id AS id,
          tb_user_video.viewed_count AS view_count,
          tb_user_video_like_statistic.like_count as like_count
        FROM
          user_data
          LEFT JOIN tb_user_video ON tb_user_video.user_auth_id = user_data.id
          LEFT JOIN tb_user_video_like_statistic ON tb_user_video_like_statistic.user_video_id = tb_user_video.id
      ),
      post AS (
        SELECT
          user_data.id as user_auth_id,
          tb_post.id AS id,
          tb_post.viewed_count AS view_count,
          tb_post_like_statistic.like_count AS like_count
        FROM
          user_data
          LEFT JOIN tb_post ON tb_post.user_auth_id = user_data.id
          LEFT JOIN tb_post_like_statistic ON tb_post_like_statistic.post_id = tb_post.id
      ),
      stats AS (
        SELECT
          user_data.id AS user_auth_id,
          CAST(COALESCE(COUNT(DISTINCT image.id), '0') as INTEGER) AS image_count,
          CAST(COALESCE(COUNT(DISTINCT video.id), '0') as INTEGER) AS video_count,
          CAST(COALESCE(COUNT(DISTINCT post.id), '0') as INTEGER) AS post_count,
          CAST(COALESCE(SUM(image.view_count), '0') as INTEGER) AS image_view_count,
          CAST(COALESCE(SUM(video.view_count), '0') as INTEGER) AS video_view_count,
          CAST(COALESCE(SUM(post.view_count), '0') as INTEGER) AS post_view_count,
          CAST(COALESCE(SUM(image.like_count), '0') as INTEGER) AS image_like_count,
          CAST(COALESCE(SUM(video.like_count), '0') as INTEGER) AS video_like_count,
          CAST(COALESCE(SUM(post.like_count), '0') as INTEGER) AS post_like_count
        FROM
          user_data
          LEFT JOIN image ON image.user_auth_id = user_data.id
          LEFT JOIN video ON video.user_auth_id = user_data.id
          LEFT JOIN post ON post.user_auth_id = user_data.id
        GROUP BY
          user_data.id
      )
      SELECT
        DISTINCT user_data.id,
        user_data.name,
        ${
          sortBy == `coin_balance`
            ? `CAST(COALESCE(coin_balance.balance, '0') as FLOAT) AS coin_balance,`
            : ``
        }
        ${
          sortBy == `gallery_count`
            ? `gallery.gallery_count AS gallery_count,`
            : ``
        }
        ${sortBy == `image_count` ? `stats.image_count AS image_count,` : ``}
        ${sortBy == `video_count` ? `stats.video_count AS video_count,` : ``}
        ${sortBy == `post_count` ? `stats.post_count AS post_count,` : ``}
        ${
          sortBy == `view_count`
            ? `(stats.image_view_count + stats.video_view_count + stats.post_view_count) AS view_count,`
            : ``
        }
        ${
          sortBy == `like_count`
            ? `(stats.image_like_count + stats.video_like_count + stats.post_like_count) AS like_count,`
            : ``
        }
        ${
          sortBy == `follower_count`
            ? `CAST(COALESCE(follow.follower_count, '0') AS INTEGER) AS follower_count,`
            : ``
        }
        ${
          sortBy == `following_count`
            ? `CAST(COALESCE(follow.following_count, '0') AS INTEGER) AS following_count,`
            : ``
        }
        user_avatar.avatar_image AS avatar_image
      FROM
        user_data
        LEFT JOIN user_avatar ON user_avatar.user_auth_id = user_data.id
        LEFT JOIN coin_balance ON coin_balance.user_auth_id = user_data.id
        LEFT JOIN stats ON stats.user_auth_id = user_data.id
        LEFT JOIN gallery ON gallery.user_auth_id = user_data.id
        LEFT JOIN follow ON follow.user_auth_id = user_data.id
      ORDER BY
        ${sortBy} ${orderBy}
      LIMIT $1
      OFFSET $2
      `,
      values,
    );
    return list;
  }
  async get(body: UserProfileGetRequest): Promise<any> {
    const { id } = body;
    const values = [id];
    const { rows: list } = await pg.query(
      ` 
      WITH user_data AS (
        SELECT
          DISTINCT tb_user_auth.id,
          tb_user_auth.name
        FROM
          tb_user_auth
        WHERE
          tb_user_auth.id = $1
      ),
      user_extra_data AS (
        SELECT
          user_data.id AS user_auth_id,
          tb_user_auth.created_on,
          tb_user_auth.last_login,
          tb_phone.phone AS phone,
          to_json(tb_subscription_type) AS subscription_type,
          jsonb_build_object('url', user_auth_avatar_image.url) AS avatar_image,
          jsonb_build_object(
            'email',
            tb_official_user.email,
            'expiry_date',
            tb_official_user.expiry_date,
            'start_date',
            tb_official_user.start_date
          ) as official,
          tb_user_auth_profile_data.about AS about,
          jsonb_build_object(
            'day_streak',
            tb_user_day_streak.day_streak,
            'last_time',
            tb_user_day_streak.last_time
          ) AS day_streak
        FROM
          user_data
          LEFT JOIN tb_user_auth ON tb_user_auth.id = user_data.id
          LEFT JOIN tb_phone ON tb_phone.user_auth_id = user_data.id
          LEFT JOIN tb_user_subscription_type ON tb_user_subscription_type.user_auth_id = user_data.id
          LEFT JOIN tb_subscription_type ON tb_subscription_type.id = tb_user_subscription_type.subscription_type_id
          LEFT JOIN tb_user_auth_avatar_image ON tb_user_auth_avatar_image.user_auth_id = user_data.id
          LEFT JOIN tb_image AS user_auth_avatar_image ON user_auth_avatar_image.id = tb_user_auth_avatar_image.image_id
          LEFT JOIN tb_official_user ON tb_official_user.user_auth_id = user_data.id
          LEFT JOIN tb_user_auth_profile_data ON tb_user_auth_profile_data.user_auth_id = user_data.id
          LEFT JOIN tb_user_day_streak ON tb_user_day_streak.user_auth_id = user_data.id
      ),
      user_location AS (
        SELECT
          user_data.id AS user_auth_id,
          json_agg(tb_location) AS location
        FROM
          user_data
          LEFT JOIN tb_user_location ON tb_user_location.user_auth_id = user_data.id
          LEFT JOIN tb_location ON tb_location.id = tb_user_location.location_id
        GROUP BY
          user_data.id
      ),
      follow AS (
        SELECT
          user_data.id as user_auth_id,
          tb_user_follower_statistic.follower_count AS follower_count,
          tb_user_follower_statistic.following_count AS following_count
        FROM
          user_data
          LEFT JOIN tb_user_follower_statistic ON tb_user_follower_statistic.user_auth_id = user_data.id
      ),
      coin_balance AS (
        SELECT
          user_data.id as user_auth_id,
          tb_user_coin_balance.balance AS balance,
          tb_user_coin_balance_statistics AS stats
        FROM
          user_data
          LEFT JOIN tb_user_coin_balance ON tb_user_coin_balance.user_auth_id = user_data.id
          LEFT JOIN tb_user_coin_balance_statistics ON tb_user_coin_balance_statistics.coin_balance_id = tb_user_coin_balance.id
      ),
      gallery AS (
        SELECT
          user_data.id as user_auth_id,
          CAST(COALESCE(COUNT(DISTINCT tb_gallery.id), '0') as INTEGER) AS gallery_count
        FROM
          user_data
          LEFT JOIN tb_gallery ON tb_gallery.user_auth_id = user_data.id
        GROUP BY
          user_data.id
      ),
      image AS (
        SELECT
          user_data.id as user_auth_id,
          tb_user_image.id AS id,
          tb_user_image.viewed_count AS view_count,
          tb_user_image_like_statistic.like_count as like_count
        FROM
          user_data
          LEFT JOIN tb_user_image ON tb_user_image.user_auth_id = user_data.id
          LEFT JOIN tb_user_image_like_statistic ON tb_user_image_like_statistic.user_image_id = tb_user_image.id
      ),
      bg_image AS (
        SELECT
          user_data.id as user_auth_id,
          array_agg(tb_image.url) AS images
        FROM
          user_data
          LEFT JOIN tb_user_auth_profile_background_image ON tb_user_auth_profile_background_image.user_auth_id = user_data.id
          LEFT JOIN tb_image ON tb_image.id = tb_user_auth_profile_background_image.image_id
        GROUP BY
          user_data.id
      ),
      video AS (
        SELECT
          user_data.id as user_auth_id,
          tb_user_video.id AS id,
          tb_user_video.viewed_count AS view_count,
          tb_user_video_like_statistic.like_count as like_count
        FROM
          user_data
          LEFT JOIN tb_user_video ON tb_user_video.user_auth_id = user_data.id
          LEFT JOIN tb_user_video_like_statistic ON tb_user_video_like_statistic.user_video_id = tb_user_video.id
      ),
      post AS (
        SELECT
          user_data.id as user_auth_id,
          tb_post.id AS id,
          tb_post.waiting AS waiting,
          tb_post.approved AS approved,
          tb_post.viewed_count AS view_count,
          tb_post_like_statistic.like_count AS like_count
        FROM
          user_data
          LEFT JOIN tb_post ON tb_post.user_auth_id = user_data.id
          LEFT JOIN tb_post_like_statistic ON tb_post_like_statistic.post_id = tb_post.id
      ),
      my_like_statistics AS (
        SELECT
          user_data.id AS user_auth_id,
          CAST(COALESCE(COUNT(DISTINCT tb_post_like.id), '0') as INTEGER) AS post_like,
          CAST(COALESCE(COUNT(DISTINCT tb_user_video_like.id), '0') as INTEGER) AS video_like,
          CAST(COALESCE(COUNT(DISTINCT tb_user_image_like.id), '0') as INTEGER) AS image_like
        FROM
          user_data
          LEFT JOIN tb_post_like ON tb_post_like.user_auth_id = user_data.id
          LEFT JOIN tb_user_video_like ON tb_user_video_like.user_auth_id = user_data.id
          LEFT JOIN tb_user_image_like ON tb_user_image_like.user_auth_id = user_data.id
        GROUP BY
          user_data.id
      ),
      stats AS (
        SELECT
          user_data.id AS user_auth_id,
          CAST(COALESCE(COUNT(DISTINCT image.id), '0') as INTEGER) AS image_count,
          CAST(COALESCE(COUNT(DISTINCT video.id), '0') as INTEGER) AS video_count,
          CAST(COALESCE(COUNT(DISTINCT post.id), '0') as INTEGER) AS post_count,
          CAST(COALESCE(SUM(image.view_count), '0') as INTEGER) AS image_view_count,
          CAST(COALESCE(SUM(video.view_count), '0') as INTEGER) AS video_view_count,
          CAST(COALESCE(SUM(post.view_count), '0') as INTEGER) AS post_view_count,
          CAST(COALESCE(SUM(image.like_count), '0') as INTEGER) AS image_like_count,
          CAST(COALESCE(SUM(video.like_count), '0') as INTEGER) AS video_like_count,
          CAST(COALESCE(SUM(post.like_count), '0') as INTEGER) AS post_like_count,
          CAST(COALESCE(COUNT(DISTINCT post.id) FILTER (WHERE post.waiting = TRUE), '0') as INTEGER) AS post_waiting_count, 
          CAST(COALESCE(COUNT(DISTINCT post.id) FILTER (WHERE post.approved = TRUE), '0') as INTEGER) AS post_approved_count,
          CAST(COALESCE(COUNT(DISTINCT post.id) FILTER (WHERE post.waiting = FALSE AND post.approved = FALSE), '0') as INTEGER) AS post_declined_count
        FROM
          user_data
          LEFT JOIN image ON image.user_auth_id = user_data.id
          LEFT JOIN video ON video.user_auth_id = user_data.id
          LEFT JOIN post ON post.user_auth_id = user_data.id
        GROUP BY
          user_data.id
      )
      SELECT
        user_data.id,
        user_data.name,
        user_extra_data.created_on,
        user_extra_data.last_login,
        user_extra_data.phone,
        user_extra_data.subscription_type,
        user_extra_data.avatar_image,
        user_extra_data.official,
        user_extra_data.day_streak,
        user_extra_data.about,
        bg_image.images AS background_image,
        CAST(COALESCE(coin_balance.balance, '0') as FLOAT) AS coin_balance,
        to_json(coin_balance.stats) AS coin_stats,
        gallery.gallery_count AS gallery_count,
        stats.image_count AS image_count,
        stats.video_count AS video_count,
        stats.post_count AS post_count,
        stats.post_waiting_count AS post_waiting_count,
        stats.post_approved_count AS post_approved_count,
        stats.post_declined_count AS post_declined_count,
        (
          stats.image_view_count + stats.video_view_count + stats.post_view_count
        ) AS view_count,
        (
          my_like_statistics.post_like + my_like_statistics.video_like + my_like_statistics.image_like
        ) AS like_count,
        stats.image_like_count AS image_like_count,
        stats.video_like_count AS video_like_count,
        stats.post_like_count AS post_like_count,
        CAST(COALESCE(follow.follower_count, '0') AS INTEGER) AS follower_count,
        CAST(COALESCE(follow.following_count, '0') AS INTEGER) AS following_count
      FROM
        user_data
        LEFT JOIN user_extra_data ON user_extra_data.user_auth_id = user_data.id
        LEFT JOIN coin_balance ON coin_balance.user_auth_id = user_data.id
        LEFT JOIN stats ON stats.user_auth_id = user_data.id
        LEFT JOIN gallery ON gallery.user_auth_id = user_data.id
        LEFT JOIN follow ON follow.user_auth_id = user_data.id
        LEFT JOIN bg_image ON bg_image.user_auth_id = user_data.id
        LEFT JOIN my_like_statistics ON my_like_statistics.user_auth_id = user_data.id
      `,
      values,
    );
    return list.length > 0 ? list[0] : null;
  }
  async update(
    body: UserProfileUpdateRequest,
  ): Promise<ApiResponse<undefined>> {
    try {
      const { current_user_id, name, about } = body;
      if (name !== undefined) {
        await pg.query(
          `
          UPDATE
            tb_user_auth
          SET
            name = $2
          WHERE
            tb_user_auth.id = $1`,
          [current_user_id, name],
        );
      }

      if (about !== undefined) {
        await pg.query(
          `
          UPDATE
            tb_user_auth_profile_data
          SET
            about = $2
          WHERE
            tb_user_auth_profile_data.user_auth_id = $1`,
          [current_user_id, about],
        );
      }

      return {
        status: true,
        message: "User profile updated successfully!",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async setAvatar(
    body: UserProfileSetAvatarRequest,
  ): Promise<ApiResponse<undefined>> {
    try {
      const { id, image } = body;
      const { rows: imageList } = await pg.query(
        `SELECT * FROM tb_user_auth_avatar_image WHERE tb_user_auth_avatar_image.user_auth_id = $1`,
        [id],
      );
      if (imageList.length > 0) {
        await pg.query(
          `
          WITH
            av_img AS (DELETE FROM tb_user_auth_avatar_image WHERE tb_user_auth_avatar_image.user_auth_id = $1 RETURNING *)
          DELETE FROM tb_image WHERE tb_image.id = $2`,
          [id, imageList[0].image_id],
        );
      }
      const { rows: newImageList } = await pg.query(
        `INSERT INTO tb_image(url) VALUES ($1) RETURNING *`,
        [image],
      );
      await pg.query(
        `INSERT INTO tb_user_auth_avatar_image(user_auth_id, image_id) VALUES($2, $1)`,
        [newImageList[0].id, id],
      );
      return {
        status: true,
        message: "Avatar image set successfully!",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async follow(body: UserFollowRequest): Promise<ApiResponse<undefined>> {
    try {
      const { id, current_user_id } = body;
      const { rows: followList } = await pg.query(
        `
        SELECT
          tb_user_follower.id
        FROM
          tb_user_follower
        WHERE
          tb_user_follower.user_auth_id = $1 AND tb_user_follower.follower_user_auth_id = $2`,
        [id, current_user_id],
      );
      if (followList.length > 0) {
        return {
          status: false,
          message: "User already subscribed!",
        };
      }
      await pg.query(
        `INSERT INTO tb_user_follower(user_auth_id, follower_user_auth_id) VALUES ($1, $2)`,
        [id, current_user_id],
      );

      return {
        status: true,
        message: "User subscribed successfully!",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async unFollow(body: UserUnFollowRequest): Promise<ApiResponse<undefined>> {
    try {
      const { id, current_user_id } = body;
      const { rows: followList } = await pg.query(
        `
        SELECT
          tb_user_follower.id
        FROM
          tb_user_follower
        WHERE
          tb_user_follower.user_auth_id = $1 AND tb_user_follower.follower_user_auth_id = $2`,
        [id, current_user_id],
      );
      if (followList.length == 0) {
        return {
          status: false,
          message: "User already unsubscribed!",
        };
      }
      await pg.query(
        `DELETE FROM
          tb_user_follower
        WHERE
          tb_user_follower.user_auth_id = $1 AND tb_user_follower.follower_user_auth_id = $2`,
        [id, current_user_id],
      );
      return {
        status: true,
        message: "User unsubscribed successfully!",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async setDayStreak(
    body: UserDayStreakSetRequest,
  ): Promise<ApiResponse<undefined>> {
    try {
      const { current_user_id } = body;
      const { rows: dayStreakList } = await pg.query(
        `
        UPDATE
          tb_user_day_streak
        SET
          day_streak = day_streak + 1,
          last_time = CURRENT_TIMESTAMP
        WHERE
          tb_user_day_streak.user_auth_id = $1 AND
          date_trunc('day', CURRENT_TIMESTAMP) > date_trunc('day', tb_user_day_streak.last_time)
        RETURNING
          tb_user_day_streak.day_streak`,
        [current_user_id],
      );

      return {
        status: true,
        message: "User set day streak successfully!",
        data: dayStreakList.length > 0 ? dayStreakList[0] : null,
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async listDayStreakCoinReward(
    body: UserDayStreakCoinRewardListRequest,
  ): Promise<ApiResponse<any[]>> {
    try {
      const {} = body;
      const { rows: dayStreakCoinRewardList } = await pg.query(
        `
        SELECT
          tb_day_streak_coin_amount.*
        FROM
          tb_day_streak_coin_amount
        ORDER BY
          tb_day_streak_coin_amount.day_id`,
      );

      return {
        status: true,
        message: "User list day streak coin reward successfully!",
        data: dayStreakCoinRewardList,
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async addUserProfileBackgroundImage(
    body: UserProfileBackgroundImageAddRequest,
  ): Promise<ApiResponse<any>> {
    try {
      const { current_user_id, images } = body;
      const { rows: imageList } = await pg.query(
        `INSERT INTO tb_image(url) SELECT unnest(ARRAY[$1::varchar[]]) RETURNING id`,
        [images],
      );
      const imageIds = imageList.reduce((acc, curValue) => {
        return [...acc, curValue.id];
      }, []);

      await pg.query(
        `INSERT INTO tb_user_auth_profile_background_image(user_auth_id, image_id) SELECT $1, unnest($2::int[])`,
        [current_user_id, imageIds],
      );
      const { rows: background_images } = await pg.query(
        `SELECT
          tb_image.*
        FROM
          tb_user_auth_profile_background_image
          LEFT JOIN tb_image ON tb_image.id = tb_user_auth_profile_background_image.image_id
        WHERE
          tb_user_auth_profile_background_image.user_auth_id = $1`,
        [current_user_id],
      );
      return {
        status: true,
        message: "Profile background images added successfully!",
        data: background_images,
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async deleteUserProfileBackgroundImage(
    body: UserProfileBackgroundImageDeleteRequest,
  ): Promise<ApiResponse<any>> {
    try {
      const { current_user_id, image_ids } = body;
      await pg.query(
        `DELETE FROM
          tb_image
        WHERE
          tb_image.id = ANY(SELECT unnest(ARRAY[$1::int[]]))`,
        [image_ids],
      );

      const { rows: background_images } = await pg.query(
        `SELECT
          tb_image.*
        FROM
          tb_user_auth_profile_background_image
          LEFT JOIN tb_image ON tb_image.id = tb_user_auth_profile_background_image.image_id
        WHERE
          tb_user_auth_profile_background_image.user_auth_id = $1`,
        [current_user_id],
      );
      return {
        status: true,
        message: "Profile background images deleted successfully!",
        data: background_images,
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }
}
