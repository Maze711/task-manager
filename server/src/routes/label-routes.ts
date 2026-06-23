import { Router } from "express"
import * as labelController from "../controller/label-controller"

const router = Router()

/**
 * @openapi
 * /labels:
 *   get:
 *     summary: List all labels
 *     tags: [Labels]
 *     responses:
 *       200:
 *         description: Array of labels
 */
router.get("/", labelController.getAll)

/**
 * @openapi
 * /labels/{id}:
 *   get:
 *     summary: Get a single label by ID
 *     tags: [Labels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Label object
 *       404:
 *         description: Label not found
 */
router.get("/:id", labelController.getById)

/**
 * @openapi
 * /labels:
 *   post:
 *     summary: Create a new label
 *     tags: [Labels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created label
 *       400:
 *         description: Label name is required
 */
router.post("/", labelController.create)

/**
 * @openapi
 * /labels/{id}:
 *   put:
 *     summary: Update a label
 *     tags: [Labels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated label
 *       404:
 *         description: Label not found
 */
router.put("/:id", labelController.update)

/**
 * @openapi
 * /labels/{id}:
 *   delete:
 *     summary: Delete a label
 *     tags: [Labels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Label deleted successfully
 *       404:
 *         description: Label not found
 */
router.delete("/:id", labelController.remove)

export default router
