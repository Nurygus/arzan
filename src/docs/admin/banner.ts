/**
 * @swagger
 * /admin/banner:
 *      put:
 *          security:
 *              - bearerAuth: []
 *          tags:
 *              - Banner
 *          description: Banner edit
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          properties:
 *                              id:
 *                                  type: number
 *                                  example: 1
 *                              title:
 *                                  type: string
 *                                  example: Banner title
 *                              description:
 *                                  type: string
 *                                  example: Banner description
 *                              url:
 *                                  type: string
 *                                  example: Banner url
 *                              image:
 *                                  type: string
 *                                  format: binary
 *                                  example: hyzmat.png
 *                              start_date:
 *                                  type: Date
 *                                  example: 2023-08-12T14:22:11.289Z
 *                              end_date:
 *                                  type: Date
 *                                  example: 2023-10-12T14:22:11.289Z
 *                              platform_id:
 *                                  type: number
 *                                  example: 1
 *                              page_category_ids:
 *                                  type: number[]
 *                                  example: [1, 3]
 *                              location_ids:
 *                                  type: number[]
 *                                  example: [1, 3]
 *
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
 *                                      example: Banner edited successfully
 *                                  data:
 *                                      type: any
 *                                      description: Banner data
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
