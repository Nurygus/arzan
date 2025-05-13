/**
 * @swagger
 * /admin/video:
 *      put:
 *          security:
 *              - bearerAuth: []
 *          tags:
 *              - Video
 *          description: Video edit
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          properties:
 *                              id:
 *                                  type: number
 *                                  example: 1
 *                              user_id:
 *                                  type: number
 *                                  example: 1
 *                              title:
 *                                  type: string
 *                                  example: my video
 *                              page_category_ids:
 *                                  type: number[]
 *                                  example: [1, 2]
 *                              thumbnail:
 *                                  type: string
 *                                  format: binary
 *                                  example: thumbnail.png
 *                          required:
 *                              - id
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
 *                                      example: Video edited successfully
 *                                  data:
 *                                      type: any
 *                                      description: Video data
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
