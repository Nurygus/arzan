DROP TABLE IF EXISTS tb_image,
tb_video_thumbnail,
tb_video,
tb_page,
tb_tag,
tb_platform,
tb_location,
tb_category,
tb_publication_type,
tb_publication_type_like_amount,
tb_page_category,
tb_page_category_statistic,
tb_phone,
tb_post_category,
tb_post_sub_category,
tb_post_category_image,
tb_payment_image,
tb_payment,
tb_payment_order_number,
tb_user_payment,
tb_post,
tb_post_image,
tb_post_tag,
tb_post_publication_type,
tb_post_like,
tb_post_like_statistic,
tb_user_auth,
tb_user_follower,
tb_user_follower_statistic,
tb_password_recover,
tb_user_auth_avatar_image,
tb_user_coin_balance,
tb_service,
tb_service_location,
tb_unverified_user_auth,
tb_official_user,
tb_user_video,
tb_user_video_publication_type,
tb_user_video_page_category,
tb_user_video_like,
tb_user_video_like_statistic,
tb_user_location,
tb_subscription_type,
tb_user_subscription_type,
tb_admin_auth,
tb_banner,
tb_banner_image,
tb_banner_location,
tb_banner_page_category,
tb_banner_platform,
tb_gallery,
tb_gallery_page_category,
tb_user_image,
tb_user_image_publication_type,
tb_user_image_like,
tb_user_image_like_statistic,
tb_gallery_user_image,
tb_user_follow_coin_amount,
tb_day_streak_coin_amount,
tb_user_day_streak,
tb_top_list_limit,
tb_user_auth_profile_data,
tb_user_auth_profile_background_image,
tb_user_coin_balance_statistics;

DROP TRIGGER IF EXISTS on_new_user_auth ON tb_user_auth;
DROP TRIGGER IF EXISTS on_new_service ON tb_service;
DROP TRIGGER IF EXISTS on_new_user_coin_balance ON tb_user_coin_balance;
DROP TRIGGER IF EXISTS on_new_user_follower ON tb_user_follower;
DROP TRIGGER IF EXISTS on_delete_user_follower ON tb_user_follower;
DROP TRIGGER IF EXISTS on_delete_post_like ON tb_post_like;
DROP TRIGGER IF EXISTS on_delete_user_video_like ON tb_user_video_like;
DROP TRIGGER IF EXISTS on_delete_user_image_like ON tb_user_image_like;
DROP TRIGGER IF EXISTS on_delete_page_category ON tb_page_category;
DROP TRIGGER IF EXISTS on_delete_user_video_page_category ON tb_user_video_page_category;
DROP TRIGGER IF EXISTS on_delete_gallery_page_category ON tb_gallery_page_category;
DROP TRIGGER IF EXISTS on_update_user_day_streak ON tb_user_day_streak;


DROP FUNCTION IF EXISTS
on_new_user_coin_balance(),
on_new_user_auth(),
on_new_service(),
on_new_user_follower(),
on_delete_user_follower(),
on_new_post(),
on_new_post_like(),
on_delete_post_like(),
on_new_user_video(),
on_new_user_video_like(),
on_delete_user_video_like(),
on_new_user_image(),
on_new_user_image_like(),
on_delete_user_image_like(),
on_new_subscription_type(),
on_new_location(),
on_new_page_category(),
on_new_user_video_page_category(),
on_new_gallery_page_category(),
on_update_user_day_streak(),
cron_1d();

CREATE TABLE tb_image (
  id serial PRIMARY KEY,
  url VARCHAR(256) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_video (
  id serial PRIMARY KEY,
  url VARCHAR(256) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_tag (
  id serial PRIMARY KEY,
  name VARCHAR(56) NOT NULL
);

CREATE TABLE tb_page (
  id serial PRIMARY KEY,
  name VARCHAR (50) NOT NULL
);

CREATE TABLE tb_platform (
  id serial PRIMARY KEY,
  name VARCHAR (50) NOT NULL
);

CREATE TABLE tb_location (
  id serial PRIMARY KEY,
  name VARCHAR (50) UNIQUE NOT NULL,
  display_name VARCHAR (50) UNIQUE NOT NULL
);

CREATE TABLE tb_category (
  id serial PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE tb_publication_type (
  id serial PRIMARY KEY,
  type VARCHAR(64) NOT NULL
);

CREATE TABLE tb_publication_type_like_amount (
  id serial PRIMARY KEY,
  amount FLOAT DEFAULT 0,
  publication_type_id INT NOT NULL,
  FOREIGN KEY (publication_type_id) REFERENCES tb_publication_type (id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_user_auth (
  id serial PRIMARY KEY,
  name VARCHAR (50) UNIQUE NOT NULL,
  password VARCHAR (72) NOT NULL,
  verify BOOLEAN DEFAULT false,
  created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_user_auth_profile_data (
  id serial PRIMARY KEY,
  user_auth_id INT NOT NULL,
  FOREIGN KEY (user_auth_id) REFERENCES tb_user_auth (id) ON DELETE CASCADE,
  about TEXT DEFAULT '',
  last_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_user_auth_profile_background_image (
  id serial PRIMARY KEY,
  user_auth_id INT NOT NULL,
  image_id INT NOT NULL,
  FOREIGN KEY (user_auth_id) REFERENCES tb_user_auth (id) ON DELETE CASCADE,
  FOREIGN KEY (image_id) REFERENCES tb_image (id) ON DELETE CASCADE
);

CREATE TABLE tb_user_follower (
  id serial PRIMARY KEY,
  user_auth_id INT NOT NULL,
  FOREIGN KEY (user_auth_id) REFERENCES tb_user_auth (id) ON DELETE CASCADE,
  follower_user_auth_id INT NOT NULL,
  FOREIGN KEY (follower_user_auth_id) REFERENCES tb_user_auth (id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_user_follower_statistic (
  id serial PRIMARY KEY,
  user_auth_id INT UNIQUE NOT NULL,
  FOREIGN KEY (user_auth_id) REFERENCES tb_user_auth (id) ON DELETE CASCADE,
  follower_count BIGINT DEFAULT 0,
  following_count BIGINT DEFAULT 0,
  last_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE FUNCTION on_new_user_follower() RETURNS trigger AS $$
BEGIN
  UPDATE
    tb_user_follower_statistic
  SET
    follower_count = follower_count + 1,
    last_time = CURRENT_TIMESTAMP
  WHERE
    user_auth_id = NEW.user_auth_id;
  UPDATE
    tb_user_follower_statistic
  SET
    following_count = following_count + 1,
    last_time = CURRENT_TIMESTAMP
  WHERE
    user_auth_id = NEW.follower_user_auth_id;

  WITH x AS (
    UPDATE
      tb_user_coin_balance
    SET
      balance = balance + CAST(COALESCE((
        SELECT
          tb_user_follow_coin_amount.coin_amount
        FROM
          tb_user_follow_coin_amount
          LEFT JOIN tb_user_subscription_type ON tb_user_subscription_type.user_auth_id = NEW.follower_user_auth_id
          LEFT JOIN tb_user_location ON tb_user_location.user_auth_id = NEW.follower_user_auth_id
        WHERE
          tb_user_follow_coin_amount.subscription_type_id = tb_user_subscription_type.id AND
          tb_user_follow_coin_amount.location_id = tb_user_location.id
        LIMIT 1
        ), '0') as FLOAT)
    WHERE
      tb_user_coin_balance.user_auth_id = NEW.user_auth_id
    RETURNING *
  )
  UPDATE
    tb_user_coin_balance_statistics
  SET
    follow_reward_coin = follow_reward_coin + CAST(COALESCE((
        SELECT
          tb_user_follow_coin_amount.coin_amount
        FROM
          tb_user_follow_coin_amount
          LEFT JOIN tb_user_subscription_type ON tb_user_subscription_type.user_auth_id = NEW.follower_user_auth_id
          LEFT JOIN tb_user_location ON tb_user_location.user_auth_id = NEW.follower_user_auth_id
        WHERE
          tb_user_follow_coin_amount.subscription_type_id = tb_user_subscription_type.id AND
          tb_user_follow_coin_amount.location_id = tb_user_location.id
        LIMIT 1
        ), '0') as FLOAT),
    last_modified = CURRENT_TIMESTAMP
  FROM
    x
  WHERE
    tb_user_coin_balance_statistics.coin_balance_id = x.id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_new_user_follower AFTER INSERT
  ON tb_user_follower FOR EACH ROW EXECUTE FUNCTION on_new_user_follower();


CREATE FUNCTION on_delete_user_follower() RETURNS trigger AS $$
BEGIN
  UPDATE
    tb_user_follower_statistic
  SET
    follower_count = follower_count - 1,
    last_time = CURRENT_TIMESTAMP
  WHERE
    user_auth_id = OLD.user_auth_id;
  UPDATE
    tb_user_follower_statistic
  SET
    following_count = following_count - 1,
    last_time = CURRENT_TIMESTAMP
  WHERE
    user_auth_id = OLD.follower_user_auth_id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_delete_user_follower AFTER DELETE
  ON tb_user_follower FOR EACH ROW EXECUTE FUNCTION on_delete_user_follower();


CREATE TABLE tb_password_recover (
  id serial PRIMARY KEY,
  user_auth_id INT NOT NULL,
  FOREIGN KEY (user_auth_id) REFERENCES tb_user_auth (id) ON DELETE CASCADE
);

CREATE TABLE tb_user_coin_balance (
  id serial PRIMARY KEY,
  user_auth_id INT NOT NULL,
  FOREIGN KEY (user_auth_id) REFERENCES tb_user_auth (id) ON DELETE CASCADE,
  balance FLOAT DEFAULT 0,
  created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_user_coin_balance_statistics (
  coin_balance_id INT NOT NULL UNIQUE,
  FOREIGN KEY (coin_balance_id) REFERENCES tb_user_coin_balance (id) ON DELETE CASCADE,
  like_coin FLOAT DEFAULT 0,
  comment_coin FLOAT DEFAULT 0,
  post_coin FLOAT DEFAULT 0,
  guest_coin FLOAT DEFAULT 0,
  follow_reward_coin FLOAT DEFAULT 0,
  referral_coin FLOAT DEFAULT 0,
  day_streak_reward_coin FLOAT DEFAULT 0,
  created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE FUNCTION on_new_user_coin_balance() RETURNS trigger AS $$
BEGIN
  INSERT INTO
    tb_user_coin_balance_statistics (coin_balance_id)
  VALUES
    (NEW.id);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_new_user_coin_balance AFTER INSERT
  ON tb_user_coin_balance FOR EACH ROW EXECUTE FUNCTION on_new_user_coin_balance();

CREATE TABLE tb_payment (
  id serial PRIMARY KEY,
  amount FLOAT NOT NULL,
  price FLOAT NOT NULL
);

CREATE TABLE tb_payment_image (
  id serial PRIMARY KEY,
  payment_id INT NOT NULL,
  image_id INT NOT NULL,
  FOREIGN KEY (payment_id) REFERENCES tb_payment (id) ON DELETE CASCADE,
  FOREIGN KEY (image_id) REFERENCES tb_image (id) ON DELETE CASCADE
);

CREATE TABLE tb_payment_order_number (
  id serial PRIMARY KEY,
  order_number BIGSERIAL UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_user_payment (
  order_number INT NOT NULL,
  order_id VARCHAR(16) NOT NULL,
  user_auth_id INT NOT NULL,
  payment_id INT NOT NULL,
  status BOOLEAN DEFAULT false,
  FOREIGN KEY (order_number) REFERENCES tb_payment_order_number (order_number) ON DELETE CASCADE,
  FOREIGN KEY (user_auth_id) REFERENCES tb_user_auth (id) ON DELETE CASCADE,
  FOREIGN KEY (payment_id) REFERENCES tb_payment (id) ON DELETE CASCADE
);

CREATE TABLE tb_page_category (
  id serial PRIMARY KEY,
  page_id INT NOT NULL,
  FOREIGN KEY (page_id) REFERENCES tb_page (id) ON DELETE CASCADE,
  category_id INT NOT NULL,
  FOREIGN KEY (category_id) REFERENCES tb_category (id) ON DELETE CASCADE,
  image_id INT,
  FOREIGN KEY (image_id) REFERENCES tb_image (id) ON DELETE CASCADE
);

CREATE TABLE tb_page_category_statistic (
  page_category_id INT UNIQUE NOT NULL,
  FOREIGN KEY (page_category_id) REFERENCES tb_page_category (id) ON DELETE CASCADE,
  last_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  video_count BIGINT DEFAULT 0,
  gallery_count BIGINT DEFAULT 0
);

CREATE TABLE tb_post_category (
  id serial PRIMARY KEY,
  category_id INT NOT NULL,
  FOREIGN KEY (category_id) REFERENCES tb_category (id) ON DELETE CASCADE
);

CREATE TABLE tb_post_sub_category (
  id serial PRIMARY KEY,
  category_id INT NOT NULL,
  post_category_id INT NOT NULL,
  FOREIGN KEY (post_category_id) REFERENCES tb_post_category (id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES tb_category (id) ON DELETE CASCADE
);

CREATE TABLE tb_post_category_image (
  id serial PRIMARY KEY,
  image_id INT NOT NULL,
  post_category_id INT NOT NULL,
  FOREIGN KEY (image_id) REFERENCES tb_image (id) ON DELETE CASCADE,
  FOREIGN KEY (post_category_id) REFERENCES tb_post_category (id) ON DELETE CASCADE
);

CREATE TABLE tb_post (
  id serial PRIMARY KEY,
  user_auth_id INT NOT NULL,
  title VARCHAR(256) NOT NULL,
  phone VARCHAR(12),
  description TEXT,
  price FLOAT(24) NOT NULL,
  discount FLOAT(24) NOT NULL,
  post_category_id INT NOT NULL,
  post_sub_category_id INT NOT NULL,
  viewed_count INT DEFAULT 0,
  start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  waiting BOOLEAN DEFAULT true,
  approved BOOLEAN DEFAULT false,
  FOREIGN KEY (user_auth_id) REFERENCES tb_user_auth (id) ON DELETE CASCADE,
  FOREIGN KEY (post_category_id) REFERENCES tb_post_category (id) ON DELETE CASCADE,
  FOREIGN KEY (post_sub_category_id) REFERENCES tb_post_sub_category (id) ON DELETE CASCADE
);

CREATE TABLE tb_post_publication_type (
  id serial PRIMARY KEY,
  post_id INT NOT NULL,
  FOREIGN KEY (post_id) REFERENCES tb_post (id) ON DELETE CASCADE,
  publication_type_id INT NOT NULL,
  FOREIGN KEY (publication_type_id) REFERENCES tb_publication_type (id) ON DELETE CASCADE
);

CREATE TABLE tb_post_like (
  id serial PRIMARY KEY,
  user_auth_id INT NOT NULL,
  FOREIGN KEY (user_auth_id) REFERENCES tb_user_auth (id) ON DELETE CASCADE,
  post_id INT NOT NULL,
  FOREIGN KEY (post_id) REFERENCES tb_post (id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_post_like_statistic (
  id serial PRIMARY KEY,
  like_count BIGINT DEFAULT 0,
  post_id INT UNIQUE NOT NULL,
  FOREIGN KEY (post_id) REFERENCES tb_post (id) ON DELETE CASCADE,
  last_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE FUNCTION on_new_post() RETURNS trigger AS $$
BEGIN
  INSERT INTO
    tb_post_like_statistic (post_id)
  VALUES
    (NEW.id);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_new_post AFTER INSERT
  ON tb_post FOR EACH ROW EXECUTE FUNCTION on_new_post();


CREATE FUNCTION on_new_post_like() RETURNS trigger AS $$
BEGIN
  UPDATE
    tb_post_like_statistic
  SET
    like_count = like_count + 1,
    last_time = CURRENT_TIMESTAMP
  WHERE
    post_id = NEW.post_id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_new_post_like AFTER INSERT
  ON tb_post_like FOR EACH ROW EXECUTE FUNCTION on_new_post_like();

CREATE FUNCTION on_delete_post_like() RETURNS trigger AS $$
BEGIN
  UPDATE
    tb_post_like_statistic
  SET
    like_count = like_count - 1,
    last_time = CURRENT_TIMESTAMP
  WHERE
    post_id = OLD.post_id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_delete_post_like AFTER DELETE
  ON tb_post_like FOR EACH ROW EXECUTE FUNCTION on_delete_post_like();


CREATE TABLE tb_post_image (
  id serial PRIMARY KEY,
  post_id INT NOT NULL,
  image_id INT NOT NULL,
  FOREIGN KEY (post_id) REFERENCES tb_post (id) ON DELETE CASCADE,
  FOREIGN KEY (image_id) REFERENCES tb_image (id) ON DELETE CASCADE
);

CREATE TABLE tb_post_tag (
  id serial PRIMARY KEY,
  tag_id INT NOT NULL,
  post_id INT NOT NULL,
  FOREIGN KEY (post_id) REFERENCES tb_post (id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tb_tag (id) ON DELETE CASCADE
);

CREATE TABLE tb_phone (
  id serial PRIMARY KEY,
  phone VARCHAR (12) UNIQUE NOT NULL,
  user_auth_id INT NOT NULL,
  FOREIGN KEY (user_auth_id) REFERENCES tb_user_auth (id) ON DELETE CASCADE
);

CREATE TABLE tb_unverified_user_auth (
  id serial PRIMARY KEY,
  user_auth_id INT NOT NULL,
  FOREIGN KEY (user_auth_id) REFERENCES tb_user_auth (id) ON DELETE CASCADE
);

CREATE TABLE tb_official_user (
  id serial PRIMARY KEY,
  email VARCHAR(256),
  expiry_date TIMESTAMP,
  start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_auth_id INT NOT NULL,
  FOREIGN KEY (user_auth_id) REFERENCES tb_user_auth (id) ON DELETE CASCADE
);

CREATE TABLE tb_service (
  id serial PRIMARY KEY,
  name VARCHAR(256) NOT NULL,
  cost INT NOT NUll,
  count BOOLEAN DEFAULT false,
  month BOOLEAN DEFAULT false,
  month_cost INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_service_location (
  cost INT DEFAULT 0,
  month_cost INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  service_id INT NOT NULL,
  location_id INT NOT NULL,
  FOREIGN KEY (service_id) REFERENCES tb_service (id) ON DELETE CASCADE,
  FOREIGN KEY (location_id) REFERENCES tb_location (id) ON DELETE CASCADE
);


CREATE FUNCTION on_new_service() RETURNS trigger AS $$
BEGIN
  INSERT INTO
    tb_service_location (service_id, location_id)
  SELECT
    NEW.id, tb_location.id
  FROM
    tb_location;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_new_service AFTER INSERT
  ON tb_service FOR EACH ROW EXECUTE FUNCTION on_new_service();


CREATE TABLE tb_service_image (
  id serial PRIMARY KEY,
  service_id INT NOT NULL,
  image_id INT NOT NULL,
  FOREIGN KEY (service_id) REFERENCES tb_service (id) ON DELETE CASCADE,
  FOREIGN KEY (image_id) REFERENCES tb_image (id) ON DELETE CASCADE
);

CREATE TABLE tb_user_service_request (
  id serial PRIMARY KEY,
  count INT DEFAULT NULL,
  month INT DEFAULT NULL,
  active_time TIMESTAMP,
  service_id INT NOT NULL,
  user_auth_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES tb_service (id) ON DELETE CASCADE,
  FOREIGN KEY (user_auth_id) REFERENCES tb_user_auth (id) ON DELETE CASCADE
);

CREATE TABLE tb_user_service_request_location (
  id serial PRIMARY KEY,
  location_id INT NOT NULL,
  user_service_request_id INT NOT NULL,
  FOREIGN KEY (location_id) REFERENCES tb_location (id) ON DELETE CASCADE,
  FOREIGN KEY (user_service_request_id) REFERENCES tb_user_service_request (id) ON DELETE CASCADE
);

CREATE TABLE tb_user_auth_avatar_image (
  id serial PRIMARY KEY,
  user_auth_id INT NOT NULL,
  image_id INT NOT NULL,
  FOREIGN KEY (user_auth_id) REFERENCES tb_user_auth (id) ON DELETE CASCADE,
  FOREIGN KEY (image_id) REFERENCES tb_image (id) ON DELETE CASCADE
);

CREATE TABLE tb_user_location (
  id serial PRIMARY KEY,
  user_auth_id INT NOT NULL,
  location_id INT NOT NULL,
  FOREIGN KEY (user_auth_id) REFERENCES tb_user_auth (id) ON DELETE CASCADE,
  FOREIGN KEY (location_id) REFERENCES tb_location (id) ON DELETE CASCADE
);

CREATE TABLE tb_subscription_type (
  id serial PRIMARY KEY,
  type VARCHAR (50) UNIQUE NOT NULL
);

CREATE TABLE tb_user_subscription_type (
  id serial PRIMARY KEY,
  user_auth_id INT NOT NULL,
  subscription_type_id INT NOT NULL,
  FOREIGN KEY (user_auth_id) REFERENCES tb_user_auth (id) ON DELETE CASCADE,
  FOREIGN KEY (subscription_type_id) REFERENCES tb_subscription_type (id) ON DELETE CASCADE
);

CREATE TABLE tb_admin_auth (
  id serial PRIMARY KEY,
  email VARCHAR (50) UNIQUE NOT NULL,
  password VARCHAR (72) NOT NULL,
  created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_banner (
  id serial PRIMARY KEY,
  title VARCHAR (256) NOT NULL,
  description TEXT NOT NULL,
  url VARCHAR (256) NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_banner_image (
  id serial PRIMARY KEY,
  banner_id INT NOT NULL,
  image_id INT NOT NULL,
  FOREIGN KEY (banner_id) REFERENCES tb_banner (id) ON DELETE CASCADE,
  FOREIGN KEY (image_id) REFERENCES tb_image (id) ON DELETE CASCADE
);

CREATE TABLE tb_banner_page_category (
  id serial PRIMARY KEY,
  banner_id INT NOT NULL,
  FOREIGN KEY (banner_id) REFERENCES tb_banner (id) ON DELETE CASCADE,
  page_category_id INT NOT NULL,
  FOREIGN KEY (page_category_id) REFERENCES tb_page_category (id) ON DELETE CASCADE
);

CREATE TABLE tb_banner_platform (
  id serial PRIMARY KEY,
  banner_id INT NOT NULL,
  platform_id INT NOT NULL,
  FOREIGN KEY (banner_id) REFERENCES tb_banner (id) ON DELETE CASCADE,
  FOREIGN KEY (platform_id) REFERENCES tb_platform (id) ON DELETE CASCADE
);

CREATE TABLE tb_banner_location (
  id serial PRIMARY KEY,
  banner_id INT NOT NULL,
  FOREIGN KEY (banner_id) REFERENCES tb_banner (id) ON DELETE CASCADE,
  location_id INT NOT NULL,
  FOREIGN KEY (location_id) REFERENCES tb_location (id) ON DELETE CASCADE
);

CREATE TABLE tb_user_video (
  id serial PRIMARY KEY,
  title VARCHAR (256) NOT NULL,
  viewed_count INT DEFAULT 0,
  user_auth_id INT NOT NULL,
  FOREIGN KEY (user_auth_id) REFERENCES tb_user_auth (id) ON DELETE CASCADE,
  video_id INT NOT NULL,
  FOREIGN KEY (video_id) REFERENCES tb_video (id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_user_video_publication_type (
  id serial PRIMARY KEY,
  user_video_id INT UNIQUE NOT NULL,
  FOREIGN KEY (user_video_id) REFERENCES tb_user_video (id) ON DELETE CASCADE,
  publication_type_id INT NOT NULL,
  FOREIGN KEY (publication_type_id) REFERENCES tb_publication_type (id) ON DELETE CASCADE
);

CREATE TABLE tb_user_video_page_category (
  id serial PRIMARY KEY,
  user_video_id INT NOT NULL,
  FOREIGN KEY (user_video_id) REFERENCES tb_user_video (id) ON DELETE CASCADE,
  page_category_id INT NOT NULL,
  FOREIGN KEY (page_category_id) REFERENCES tb_page_category (id) ON DELETE CASCADE
);

CREATE TABLE tb_user_video_like (
  id serial PRIMARY KEY,
  user_auth_id INT NOT NULL,
  FOREIGN KEY (user_auth_id) REFERENCES tb_user_auth (id) ON DELETE CASCADE,
  user_video_id INT NOT NULL,
  FOREIGN KEY (user_video_id) REFERENCES tb_user_video (id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_user_video_like_statistic (
  id serial PRIMARY KEY,
  like_count BIGINT DEFAULT 0,
  user_video_id INT UNIQUE NOT NULL,
  FOREIGN KEY (user_video_id) REFERENCES tb_user_video (id) ON DELETE CASCADE,
  last_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE FUNCTION on_new_user_video() RETURNS trigger AS $$
BEGIN
  INSERT INTO
    tb_user_video_like_statistic (user_video_id)
  VALUES
    (NEW.id);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_new_user_video AFTER INSERT
  ON tb_user_video FOR EACH ROW EXECUTE FUNCTION on_new_user_video();

CREATE FUNCTION on_new_user_video_like() RETURNS trigger AS $$
BEGIN
  UPDATE
    tb_user_video_like_statistic
  SET
    like_count = like_count + 1,
    last_time = CURRENT_TIMESTAMP
  WHERE
    user_video_id = NEW.user_video_id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_new_user_video_like AFTER INSERT
  ON tb_user_video_like FOR EACH ROW EXECUTE FUNCTION on_new_user_video_like();


CREATE FUNCTION on_delete_user_video_like() RETURNS trigger AS $$
BEGIN
  UPDATE
    tb_user_video_like_statistic
  SET
    like_count = like_count - 1,
    last_time = CURRENT_TIMESTAMP
  WHERE
    user_video_id = OLD.user_video_id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_delete_user_video_like AFTER DELETE
  ON tb_user_video_like FOR EACH ROW EXECUTE FUNCTION on_delete_user_video_like();


CREATE TABLE tb_video_thumbnail (
  id serial PRIMARY KEY,
  user_video_id INT NOT NULL,
  FOREIGN KEY (user_video_id) REFERENCES tb_user_video (id) ON DELETE CASCADE,
  image_id INT NOT NULL,
  FOREIGN KEY (image_id) REFERENCES tb_image (id) ON DELETE CASCADE
);

CREATE TABLE tb_gallery (
  id serial PRIMARY KEY,
  title VARCHAR (256) NOT NULL,
  user_auth_id INT NOT NULL,
  FOREIGN KEY (user_auth_id) REFERENCES tb_user_auth (id) ON DELETE CASCADE,
  image_id INT NOT NULL,
  FOREIGN KEY (image_id) REFERENCES tb_image (id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_gallery_page_category (
  id serial PRIMARY KEY,
  gallery_id INT NOT NULL,
  FOREIGN KEY (gallery_id) REFERENCES tb_gallery (id) ON DELETE CASCADE,
  page_category_id INT NOT NULL,
  FOREIGN KEY (page_category_id) REFERENCES tb_page_category (id) ON DELETE CASCADE
);

CREATE TABLE tb_user_image (
  id serial PRIMARY KEY,
  viewed_count INT DEFAULT 0,
  user_auth_id INT NOT NULL,
  FOREIGN KEY (user_auth_id) REFERENCES tb_user_auth (id) ON DELETE CASCADE,
  image_id INT NOT NULL,
  FOREIGN KEY (image_id) REFERENCES tb_image (id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_user_image_publication_type (
  id serial PRIMARY KEY,
  user_image_id INT NOT NULL,
  FOREIGN KEY (user_image_id) REFERENCES tb_user_image (id) ON DELETE CASCADE,
  publication_type_id INT NOT NULL,
  FOREIGN KEY (publication_type_id) REFERENCES tb_publication_type (id) ON DELETE CASCADE
);

CREATE TABLE tb_user_image_like (
  id serial PRIMARY KEY,
  user_auth_id INT NOT NULL,
  FOREIGN KEY (user_auth_id) REFERENCES tb_user_auth (id) ON DELETE CASCADE,
  user_image_id INT NOT NULL,
  FOREIGN KEY (user_image_id) REFERENCES tb_user_image (id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_user_image_like_statistic (
  id serial PRIMARY KEY,
  like_count BIGINT DEFAULT 0,
  user_image_id INT UNIQUE NOT NULL,
  FOREIGN KEY (user_image_id) REFERENCES tb_user_image (id) ON DELETE CASCADE,
  last_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_top_list_limit (
  id serial PRIMARY KEY,
  name VARCHAR (50) UNIQUE NOT NULL,
  limit_count BIGINT DEFAULT 0,
  last_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE FUNCTION on_new_user_image() RETURNS trigger AS $$
BEGIN
  INSERT INTO
    tb_user_image_like_statistic (user_image_id)
  VALUES
    (NEW.id);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_new_user_image AFTER INSERT
  ON tb_user_image FOR EACH ROW EXECUTE FUNCTION on_new_user_image();

CREATE FUNCTION on_new_user_image_like() RETURNS trigger AS $$
BEGIN
  UPDATE
    tb_user_image_like_statistic
  SET
    like_count = like_count + 1,
    last_time = CURRENT_TIMESTAMP
  WHERE
    user_image_id = NEW.user_image_id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_new_user_image_like AFTER INSERT
  ON tb_user_image_like FOR EACH ROW EXECUTE FUNCTION on_new_user_image_like();

CREATE FUNCTION on_delete_user_image_like() RETURNS trigger AS $$
BEGIN
  UPDATE
    tb_user_image_like_statistic
  SET
    like_count = like_count - 1,
    last_time = CURRENT_TIMESTAMP
  WHERE
    user_image_id = OLD.user_image_id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_delete_user_image_like AFTER DELETE
  ON tb_user_image_like FOR EACH ROW EXECUTE FUNCTION on_delete_user_image_like();


CREATE TABLE tb_gallery_user_image (
  id serial PRIMARY KEY,
  gallery_id INT NOT NULL,
  FOREIGN KEY (gallery_id) REFERENCES tb_gallery (id) ON DELETE CASCADE,
  user_image_id INT NOT NULL,
  FOREIGN KEY (user_image_id) REFERENCES tb_user_image (id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_user_follow_coin_amount (
  subscription_type_id INT NOT NULL,
  FOREIGN KEY (subscription_type_id) REFERENCES tb_subscription_type (id) ON DELETE CASCADE,
  location_id INT NOT NULL,
  FOREIGN KEY (location_id) REFERENCES tb_location (id) ON DELETE CASCADE,
  coin_amount INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE FUNCTION on_new_subscription_type() RETURNS trigger AS $$
BEGIN
  WITH
    location AS (
      SELECT
        tb_location.id
      FROM
        tb_location
    )
  INSERT INTO
    tb_user_follow_coin_amount (subscription_type_id, location_id, coin_amount)
    SELECT NEW.id, location.id, 0 FROM location;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_new_subscription_type AFTER INSERT
  ON tb_subscription_type FOR EACH ROW EXECUTE FUNCTION on_new_subscription_type();

CREATE FUNCTION on_new_location() RETURNS trigger AS $$
BEGIN
  WITH
    location AS (
      SELECT
        tb_subscription_type.id
      FROM
        tb_subscription_type
    )
  INSERT INTO
    tb_user_follow_coin_amount (subscription_type_id, location_id, coin_amount)
    SELECT tb_subscription_type.id, NEW.id, 0 FROM tb_subscription_type;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_new_location AFTER INSERT
  ON tb_location FOR EACH ROW EXECUTE FUNCTION on_new_location();


CREATE TABLE tb_day_streak_coin_amount (
  day_id INT UNIQUE NOT NULL,
  coin_amount INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_user_day_streak (
  user_auth_id INT UNIQUE NOT NULL,
  FOREIGN KEY (user_auth_id) REFERENCES tb_user_auth (id) ON DELETE CASCADE,
  day_streak INT DEFAULT 0,
  last_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE FUNCTION on_new_user_auth() RETURNS trigger AS $$
BEGIN
  INSERT INTO
    tb_user_follower_statistic (user_auth_id)
  VALUES
    (NEW.id);

  INSERT INTO
    tb_user_day_streak (user_auth_id)
  VALUES
    (NEW.id);

  INSERT INTO
    tb_user_auth_profile_data (user_auth_id)
  VALUES
    (NEW.id);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_new_user_auth AFTER INSERT
  ON tb_user_auth FOR EACH ROW EXECUTE FUNCTION on_new_user_auth();


CREATE FUNCTION on_new_page_category() RETURNS trigger AS $$
BEGIN
  INSERT INTO
    tb_page_category_statistic(page_category_id)
  VALUES(NEW.id);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_new_page_category AFTER INSERT
  ON tb_page_category FOR EACH ROW EXECUTE FUNCTION on_new_page_category();


CREATE FUNCTION on_delete_page_category() RETURNS trigger AS $$
BEGIN
  DELETE FROM
    tb_page_category_statistic
  WHERE
    page_category_id = OLD.id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_delete_page_category AFTER DELETE
  ON tb_page_category FOR EACH ROW EXECUTE FUNCTION on_delete_page_category();


CREATE FUNCTION on_new_user_video_page_category() RETURNS trigger AS $$
BEGIN
  UPDATE
    tb_page_category_statistic
  SET
    video_count = video_count + 1,
    last_time = CURRENT_TIMESTAMP
  WHERE
    page_category_id = NEW.page_category_id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_new_user_video_page_category AFTER INSERT
  ON tb_user_video_page_category FOR EACH ROW EXECUTE FUNCTION on_new_user_video_page_category();


CREATE FUNCTION on_delete_user_video_page_category() RETURNS trigger AS $$
BEGIN
  UPDATE
    tb_page_category_statistic
  SET
    video_count = video_count - 1,
    last_time = CURRENT_TIMESTAMP
  WHERE
    page_category_id = OLD.page_category_id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_delete_user_video_page_category AFTER DELETE
  ON tb_user_video_page_category FOR EACH ROW EXECUTE FUNCTION on_delete_user_video_page_category();


CREATE FUNCTION on_new_gallery_page_category() RETURNS trigger AS $$
BEGIN
  UPDATE
    tb_page_category_statistic
  SET
    gallery_count = gallery_count + 1,
    last_time = CURRENT_TIMESTAMP
  WHERE
    page_category_id = NEW.page_category_id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_new_gallery_page_category AFTER INSERT
  ON tb_gallery_page_category FOR EACH ROW EXECUTE FUNCTION on_new_gallery_page_category();


CREATE FUNCTION on_delete_gallery_page_category() RETURNS trigger AS $$
BEGIN
  UPDATE
    tb_page_category_statistic
  SET
    gallery_count = gallery_count - 1,
    last_time = CURRENT_TIMESTAMP
  WHERE
    page_category_id = OLD.page_category_id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_delete_gallery_page_category AFTER DELETE
  ON tb_gallery_page_category FOR EACH ROW EXECUTE FUNCTION on_delete_gallery_page_category();


CREATE FUNCTION on_update_user_day_streak() RETURNS trigger AS $$
BEGIN
  WITH x AS (
    UPDATE
      tb_user_coin_balance
    SET
      balance = balance + CAST(COALESCE((
        SELECT
          tb_day_streak_coin_amount.coin_amount
        FROM
          tb_day_streak_coin_amount
        WHERE
          tb_day_streak_coin_amount.day_id = NEW.day_streak
        LIMIT 1
        ), '0') as FLOAT)
    WHERE
      tb_user_coin_balance.user_auth_id = NEW.user_auth_id
    RETURNING *
  )
  UPDATE
    tb_user_coin_balance_statistics
  SET
    day_streak_reward_coin = day_streak_reward_coin + CAST(COALESCE((
      SELECT
        tb_day_streak_coin_amount.coin_amount
      FROM
        tb_day_streak_coin_amount
      WHERE
        tb_day_streak_coin_amount.day_id = NEW.day_streak
      LIMIT 1
      ), '0') as FLOAT),
    last_modified = CURRENT_TIMESTAMP
  FROM
    x
  WHERE
    tb_user_coin_balance_statistics.coin_balance_id = x.id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_update_user_day_streak AFTER UPDATE
  ON tb_user_day_streak FOR EACH ROW EXECUTE FUNCTION on_update_user_day_streak();


CREATE FUNCTION cron_1d() RETURNS VOID AS $$
BEGIN
  UPDATE
    tb_user_day_streak
  SET
    day_streak = 0
  WHERE
    date_trunc('day', CURRENT_TIMESTAMP) > date_trunc('day', tb_user_day_streak.last_time);
END;
$$ LANGUAGE plpgsql;


INSERT INTO
  tb_admin_auth(email, password)
VALUES
  (
    'admin@gmail.com',
    '$2a$10$bWfI4Y1ipYT1U6U2L9/fOOmpgsT2RKW7ll.SYx041O/8IhnggjL5m'
  );

INSERT INTO
  tb_subscription_type(type)
VALUES
  ('USER');

INSERT INTO
  tb_subscription_type(type)
VALUES
  ('OFFICIAL');

INSERT INTO
  tb_subscription_type(type)
VALUES
  ('EXPIRED');

INSERT INTO
  tb_platform(name)
VALUES
  ('WEB');

INSERT INTO
  tb_platform(name)
VALUES
  ('APP');

INSERT INTO
  tb_page(name)
VALUES
  ('HOME');

INSERT INTO
  tb_page(name)
VALUES
  ('PHOTO');

INSERT INTO
  tb_page(name)
VALUES
  ('VIDEO');

INSERT INTO
  tb_location(name, display_name)
VALUES
  ('TURKMENISTAN', 'Türkmenistan');

INSERT INTO
  tb_location(name, display_name)
VALUES
  ('ASHGABAT', 'Aşgabat');

INSERT INTO
  tb_location(name, display_name)
VALUES
  ('AHAL', 'Ahal');

INSERT INTO
  tb_location(name, display_name)
VALUES
  ('MARY', 'Mary');

INSERT INTO
  tb_location(name, display_name)
VALUES
  ('LEBAP', 'Lebap');

INSERT INTO
  tb_location(name, display_name)
VALUES
  ('DASHOGUZ', 'Daşoguz');

INSERT INTO
  tb_location(name, display_name)
VALUES
  ('BALKAN', 'Balkan');

INSERT INTO
  tb_publication_type(type)
VALUES
  ('REGULAR');

INSERT INTO
  tb_publication_type(type)
VALUES
  ('PINNED');

INSERT INTO
  tb_publication_type_like_amount(publication_type_id, amount)
VALUES
  (1, 0);

INSERT INTO
  tb_publication_type_like_amount(publication_type_id, amount)
VALUES
  (2, 0);

INSERT INTO
  tb_payment_order_number(order_number)
VALUES
  (112201700000);