/**
 * @swagger
 * /admin/gallery:
 *      put:
 *          security:
 *              - bearerAuth: []
 *          tags:
 *              - Gallery
 *          description: Gallery edit
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          properties:
 *                              gallery_id:
 *                                  type: number
 *                                  example: 1
 *                              user_id:
 *                                  type: number
 *                                  example: 1
 *                              title:
 *                                  type: string
 *                                  example: Gallery title
 *                              avatar_image:
 *                                  type: string
 *                                  format: binary
 *                                  example: avatar.png
 *                              page_category_id:
 *                                  type: number
 *                                  example: 1
 *                          required:
 *                              - gallery_id
 *                          encoding:
 *                              image:
 *                                  contentType: image/png, image/jpeg, image/webp, image/svg
 *          responses:
 *              200:
 *                  description: Success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  status:
 *                                      type: boolean
 *                                      example: true
 *                                  message:
 *                                      type: string
 *                                      example: Gallery edited successfully
 *                                  data:
 *                                      type: any
 *                                      description: Gallery data
 *              400:
 *                  description: Bad Request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  status:
 *                                      type: boolean
 *                                      example: false
 *                                  message:
 *                                      type: string
 *                                      example: Error message!
 *              404:
 *                  description: Not found
 *              500:
 *                  description: Internal server error
 */

/**
 * @swagger
 * /admin/gallery/add-images:
 *      post:
 *          security:
 *              - bearerAuth: []
 *          tags:
 *              - Gallery
 *          description: Gallery add images
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          properties:
 *                              gallery_id:
 *                                  type: number
 *                                  example: 1
 *                              images:
 *                                  type: string[]
 *                                  format: binary
 *                                  example: [img1.png, img2.png]
 *                          required:
 *                              - gallery_id
 *                              - images
 *                          encoding:
 *                              image:
 *                                  contentType: image/png, image/jpeg, image/webp, image/svg
 *          responses:
 *              200:
 *                  description: Success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  status:
 *                                      type: boolean
 *                                      example: true
 *                                  message:
 *                                      type: string
 *                                      example: Gallery images added successfully!
 *                                  data:
 *                                      type: any
 *                                      description: Gallery data
 *              400:
 *                  description: Bad Request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  status:
 *                                      type: boolean
 *                                      example: false
 *                                  message:
 *                                      type: string
 *                                      example: Error message!
 *              404:
 *                  description: Not found
 *              500:
 *                  description: Internal server error
 */

/**
 * @swagger
 * /admin/gallery/delete-images:
 *      post:
 *          security:
 *              - bearerAuth: []
 *          tags:
 *              - Gallery
 *          description: Gallery delete images
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              gallery_id:
 *                                  type: number
 *                                  example: 1
 *                              image_ids:
 *                                  type: number[]
 *                                  example: [1, 3]
 *                          required:
 *                              - gallery_id
 *                              - image_ids
 *                          encoding:
 *                              image:
 *                                  contentType: image/png, image/jpeg, image/webp, image/svg
 *          responses:
 *              200:
 *                  description: Success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  status:
 *                                      type: boolean
 *                                      example: true
 *                                  message:
 *                                      type: string
 *                                      example: Gallery images deleted successfully!
 *                                  data:
 *                                      type: any
 *                                      description: Gallery data
 *              400:
 *                  description: Bad Request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  status:
 *                                      type: boolean
 *                                      example: false
 *                                  message:
 *                                      type: string
 *                                      example: Error message!
 *              404:
 *                  description: Not found
 *              500:
 *                  description: Internal server error
 */
