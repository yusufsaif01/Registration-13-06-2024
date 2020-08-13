const ReportCardService = require('../services/ReportCardService');
const responseHandler = require('../ResponseHandler');
const { checkAuthToken, checkRole } = require('../middleware/auth');
const ROLE = require('../constants/Role');
const reportCardValidator = require("../middleware/validators").reportCardValidator;

module.exports = (router) => {

    /**
    * @api {get} /manage/report-card/list report-card listing for club/academy
    * @apiName report card listing
    * @apiGroup Report-card
    * 
    * @apiParam (query) {String} search search will be done on the basis of player name
    * @apiParam (query) {String} page_no page number
    * @apiParam (query) {String} page_size page size
    * @apiParam (query) {String} sort_by sort by field name (name, category, total_report_cards, published_at, status)
    * @apiParam (query) {String} sort_order (1 for ascending, -1 for descending)
    * @apiParam (query) {String} player_category comma seperated player_category
    * @apiParam (query) {String} from from date (eg. 2020-07-10T00:00:00.000Z)
    * @apiParam (query) {String} to to date (eg. 2020-08-10T00:00:00.000Z)
    * @apiParam (query) {String} status comma seperated status
    * 
    * @apiSuccess {String} status success
    * @apiSuccess {String} message Successfully done
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *          "status": "success",
    *          "message": "Successfully done",
    *          "data": {
    *              "total": 1,
    *              "records": [
    *                  {
    *                      "user_id": "9e770dd5-629d-4d73-9e53-ad4b798a201e",
    *                      "avatar": "/uploads/avatar/user-avatar.png",
    *                      "name": "Rajesh Kumar",
    *                      "category": "grassroot",
    *                      "total_report_cards": 1,
    *                      "published_at": "2020-08-10T00:00:00.000Z",
    *                      "status": "published/draft"
    *                  },
    *              ]
    *          }
    *      }
    *
    * @apiErrorExample {json} INTERNAL_SERVER_ERROR:
    *     HTTP/1.1 500 Internal server error
    *     {
    *       "message": "Internal Server Error",
    *       "code": "INTERNAL_SERVER_ERROR",
    *       "httpCode": 500
    *     }
    * 
    */

    router.get("/manage/report-card/list", checkAuthToken, checkRole([ROLE.CLUB, ROLE.ACADEMY]),reportCardValidator.manageReportCardListValidation, function (req, res) {
        let paginationOptions = {
            page_no: (req.query && req.query.page_no) ? req.query.page_no : 1,
            limit: (req.query && req.query.page_size) ? Number(req.query.page_size) : 10
        },
            sortOptions = {
                sort_by: (req.query && req.query.sort_by) ? req.query.sort_by : "name",
                sort_order: (req.query && req.query.sort_order) ? Number(req.query.sort_order) : 1
            },
            filters = {
                search: (req.query && req.query.search) ? req.query.search : null,
                from: (req.query && req.query.from) ? req.query.from : null,
                to: (req.query && req.query.to) ? req.query.to : null,
                status: (req.query && req.query.status) ? req.query.status.split(",") : null,
                player_category: (req.query && req.query.player_category) ? req.query.player_category.split(",") : null,
            };

        let serviceInst = new ReportCardService();
        return responseHandler(req, res, serviceInst.getManageReportCardList({ authUser: req.authUser, paginationOptions, sortOptions, filters }));
    });
};
