const express = require("express");
const router = express.Router();
router.use(express.json());
const common = require("../helper/util");
  const controller = require("../controller/userController");
      /**
   * @swagger
   * /api/v1/userRegister:
   *   post:
   *     summary: User register
   *     tags:
   *       - USER
   *     description: user register
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: userName
   *         description: userName
   *         in: formData
   *         required: true
   *       - name: email
   *         description: email
   *         in: formData
   *         required: true
   *       - name: password
   *         description: password
   *         in: formData
   *         required: true
   *       - name: firstName
   *         description: firstName
   *         in: formData
   *         required: true
   *       - name: lastName
   *         description: lastName
   *         in: formData
   *         required: true
   *       - name: contactInfo
   *         description: contactInfo
   *         in: formData
   *         required: true
   *       - name: profilePicture
   *         description: profilePicture
   *         in: formData
   *         required: true
   *       - name: role
   *         description: role
   *         in: formData
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   *       401:
   *         description: User already exists 
   *       501:
   *         description: Internal server error!
   */
  router.post("/userRegister", controller.userRegister);
    /**
 * @swagger
 * /api/v1/UserLogin:
 *   post:
 *     summary: User Login
 *     tags:
 *       - USER
 *     description: user login
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: email
 *         in: formData
 *         required: true
 *       - name: password
 *         description: password
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Returns success message
 *       402:
 *         description: password does not match
 *       501:
 *         description: Something went wrong!
 */
  router.post("/UserLogin", controller.UserLogin);
    /**
      * @swagger
      * /api/v1/getProfileById:
      *   get:
      *     summary: Get profile
      *     tags:
      *       - USER
      *     description: getProfile
      *     produces:
      *       - application/json
      *     parameters:
      *       - name: authorization
      *         description: authorization
      *         in: header
      *         required: true
      *     responses:
      *       200:
      *         description: Details found successfully.
      *       404:
      *         description: User not found.
      */
  router.get("/getProfileById",common.auth,controller.getProfileById);
      /**
     * @swagger
     * /api/v1/getAllUser:
     *   get:
     *     summary: Get all users
     *     tags:
     *       - USER
     *     description: Retrieve a list of all users
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Users retrieved successfully
     *       404:
     *         description: No users found
     *       500:
     *         description: Internal server error
     */

  router.get("/getAllUser",controller.getAllUser);
      /**
     * @swagger
     * /api/v1/updateUser:
     *   put:
     *     summary: Update user details
     *     tags:
     *       - USER
     *     description: Update user's email and contact info
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: email
     *         description: Updated email address
     *         in: formData
     *         required: true
     *         type: string
     *       - name: contactInfo
     *         description: Updated contact number
     *         in: formData
     *         required: true
     *         type: string
     *       - name: Authorization
     *         in: header
     *         required: true
     *         type: string
     *         description: JWT token 
     *     responses:
     *       200:
     *         description: User details updated successfully
     *       404:
     *         description: User not found
     *       500:
     *         description: Something went wrong
     */
  router.put("/updateUser",common.auth,controller.updateUser);
      /**
     * @swagger
     * /api/v1/deleteUser:
     *   delete:
     *     summary: Delete user profile
     *     tags:
     *       - USER
     *     description: Deletes the currently authenticated user's profile
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: Authorization
     *         in: header
     *         required: true
     *         type: string
     *         description: JWT token
     *     responses:
     *       200:
     *         description: User profile deleted successfully
     *       404:
     *         description: User not found
     *       500:
     *         description: Something went wrong
     */
  router.delete("/userDelete",common.auth, controller.userDelete);
  // ADMIN ROUTER
/**
 * @swagger
 * /api/v1/getAllUserByAdmin:
 *   get:
 *     summary: Get all users by admin
 *     tags:
 *       - ADMIN
 *     description: Admin can fetch all users excluding admin
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         description: Bearer token for admin authentication
 *         type: string
 *     responses:
 *       200:
 *         description: All user list with total user count
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */
  router.get("/getAllUserByAdmin",common.auth,controller.getAllUserByAdmin);
   /**
     * @swagger
     * /api/v1/adminLogin:
     *   post:
     *     summary: Admin Login
     *     tags:
     *       - ADMIN
     *     description: Allows an admin to log in using email and password
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: email
     *         description: Admin email
     *         in: formData
     *         required: true
     *         type: string
     *       - name: password
     *         description: Admin password
     *         in: formData
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: Login successful
     *       401:
     *         description: Invalid credentials
     *       404:
     *         description: Admin not found
     *       500:
     *         description: Internal Server Error
     */
  router.post("/adminLogin",controller.adminLogin);
  /**
 * @swagger
 * /api/v1/searchUser:
 *   put:
 *     summary: Search users by admin
 *     tags:
 *       - ADMIN
 *     description: Admin can search users using status, email, id, or contactInfo
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: status
 *         in: formData
 *         description: Filter users by status (active, deleted, blocked)
 *         required: false
 *         type: string
 *         enum: [active, deleted, blocked]
 *       - name: email
 *         in: formData
 *         description: Filter users by email
 *         required: false
 *         type: string
 *       - name: id
 *         in: formData
 *         description: Filter users by user ID
 *         required: false
 *         type: string
 *       - name: contactInfo
 *         in: formData
 *         description: Filter users by 10-digit contact number
 *         required: false
 *         type: string
 *       - name: Authorization
 *         in: header
 *         description:  token for admin authentication
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Search result returned successfully
 *       400:
 *         description: Missing search parameters
 *       404:
 *         description: Admin or user not found
 *       500:
 *         description: Internal server error
 */
  router.put("/searchUser",common.auth,controller.searchUser)
  /**
 * @swagger
 * /api/v1/deleteUserByAdmin/{id}:
 *   delete:
 *     summary: Delete a user (student or teacher) by Admin
 *     tags:
 *       - ADMIN
 *     description: Admin can delete a user or teacher by ID .
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user to delete
 *         required: true
 *         type: string
 *       - name: Authorization
 *         in: header
 *         description:  token for admin authentication
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Missing or invalid user ID
 *       404:
 *         description: Admin or user not found
 *       500:
 *         description: Internal server error
 */
  router.delete("/userDeleteByAdmin/:id",common.auth,controller.userDeleteByAdmin);
  /**
 * @swagger
 * /api/v1/updateUserByAdmin/{id}:
 *   put:
 *     summary: Update student details by Admin
 *     tags:
 *       - ADMIN
 *     description: Admin can update the details (firstName, lastName, email, contactInfo) of a student.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the student to update
 *         required: true
 *         type: string
 *       - name: Authorization
 *         in: header
 *         description:  token for admin authentication
 *         required: true
 *         type: string
 *       - name: firstName
 *         in: formData
 *         description: First name of the student
 *         required: true
 *         type: string
 *       - name: lastName
 *         in: formData
 *         description: Last name of the student
 *         required: true
 *         type: string
 *       - name: email
 *         in: formData
 *         description: Email address of the student
 *         required: true
 *         type: string
 *       - name: contactInfo
 *         in: formData
 *         description: Contact information (phone number) of the student
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       400:
 *         description: Invalid data or missing parameters
 *       404:
 *         description: Admin or student not found
 *       500:
 *         description: Internal server error
 */
  router.put("/updateUserByAdmin/:id",common.auth,controller.updateUserByAdmin);
  /**
 * @swagger
 * /api/v1/getTotalStudents:
 *   get:
 *     summary: Get total students count
 *     tags:
 *       - ADMIN
 *     description: Retrieve total number of students excluding deleted ones.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description:  token
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Total student count fetched successfully.
 *       403:
 *         description: Access denied. Only admin can access this route.
 *       500:
 *         description: Internal server error.
 */
  router.get("/getTotalStudents",common.auth,controller.getTotalStudents);



module.exports=router;