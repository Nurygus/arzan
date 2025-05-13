/**
 * @swagger
 * /admin/page-category:
 *      put:
 *          security:
 *              - bearerAuth: []
 *          tags:
 *              - Page-category
 *          description: Page category edit
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          properties:
 *                              page_category_id:
 *                                  type: number
 *                                  example: 1
 *                              page_id:
 *                                  type: number
 *                                  example: 1
 *                              category_name:
 *                                  type: string
 *                                  example: food
 *                              image:
 *                                  type: string
 *                                  format: binary
 *                                  example: avatar.png
 *                          required:
 *                              - page_category_id
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
 *                                      example: Page category was edited successfully
 *                                  data:
 *                                      type: any
 *                                      description: Page category data
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
