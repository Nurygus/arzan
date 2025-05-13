/**
 * @swagger
 * /admin/service:
 *      post:
 *          security:
 *              - bearerAuth: []
 *          tags:
 *              - Service
 *          description: Hyzmatlar
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  example: Wideo goymak
 *                              cost:
 *                                  type: number
 *                                  example: 100
 *                              count:
 *                                  type: boolean
 *                                  example: true
 *                              image:
 *                                  type: string
 *                                  format: binary
 *                                  example: hyzmat.png
 *                              month:
 *                                  type: boolean
 *                              month_cost:
 *                                  type: number
 *                              location_costs:
 *                                  type: object[]
 *                                  properties:
 *                                      id:
 *                                          type: number
 *                                      cost:
 *                                          type: number
 *                                      month_cost:
 *                                          type: number
 *                                  required:
 *                                      - id
 *                          required:
 *                              - name
 *                              - cost
 *                              - image
 *                              - count
 *                          encoding:
 *                              image:
 *                                  contentType: image/png, image/jpeg
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
 *                                      example: Service created successfully!
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
 * /admin/service/{serviceId}:
 *      put:
 *          security:
 *              - bearerAuth: []
 *          tags:
 *              - Service
 *          description: Hyzmatlar uytgetmek
 *          parameters:
 *              - in: path
 *                name: serviceId
 *                schema:
 *                  type: integer
 *                required: true
 *                description: Numeric ID of the service to update
 *          requestBody:
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  example: Wideo goymak
 *                              cost:
 *                                  type: number
 *                                  example: 100
 *                              count:
 *                                  type: boolean
 *                                  example: true
 *                              image:
 *                                  type: string
 *                                  format: binary
 *                                  example: hyzmat.png
 *                              month:
 *                                  type: boolean
 *                              month_cost:
 *                                  type: number
 *                              location_costs:
 *                                  type: object[]
 *                                  properties:
 *                                      id:
 *                                          type: number
 *                                      cost:
 *                                          type: number
 *                                      month_cost:
 *                                          type: number
 *                                  required:
 *                                      - id
 *                          encoding:
 *                              image:
 *                                  contentType: image/png, image/jpeg
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
 *                                      example: Service updated successfully!
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
 * /admin/service/{serviceId}:
 *      get:
 *          security:
 *              - bearerAuth: []
 *          tags:
 *              - Service
 *          description: Hyzmat maglumatyny almak
 *          parameters:
 *              - in: path
 *                name: serviceId
 *                schema:
 *                  type: integer
 *                required: true
 *                description: Numeric ID of the service to get
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
 *                                      example: Service!
 *                                  data:
 *                                      type: object
 *                                      properties:
 *                                          id:
 *                                              type: number
 *                                          name:
 *                                              type: string
 *                                          cost:
 *                                              type: number
 *                                          image:
 *                                              type: string
 *                                          count:
 *                                              type: boolean
 *                                          month:
 *                                              type: boolean
 *                                          month_cost:
 *                                              type: number
 *                                          location_costs:
 *                                              type: object[]
 *                                              properties:
 *                                                  id:
 *                                                      type: number
 *                                                  cost:
 *                                                      type: number
 *                                                  month_cost:
 *                                                      type: number
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
 * /admin/service:
 *      get:
 *          security:
 *              - bearerAuth: []
 *          tags:
 *              - Service
 *          description: Hyzmatlar maglumatyny almak
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
 *                                      example: Service list!
 *                                  data:
 *                                      type: array
 *                                      items:
 *                                          type: object
 *                                          properties:
 *                                              id:
 *                                                  type: number
 *                                              name:
 *                                                  type: string
 *                                              cost:
 *                                                  type: number
 *                                              image:
 *                                                  type: string
 *                                              count:
 *                                                  type: boolean
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
 * /admin/service/{serviceId}:
 *      delete:
 *          security:
 *              - bearerAuth: []
 *          tags:
 *              - Service
 *          description: Hyzmat pozmak
 *          parameters:
 *              - in: path
 *                name: serviceId
 *                schema:
 *                  type: integer
 *                required: true
 *                description: Numeric ID of the service to delete
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
 *                                      example: Service deleted successfully!
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
