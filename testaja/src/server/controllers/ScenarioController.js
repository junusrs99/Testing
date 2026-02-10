const ScenarioService = require('../services/ScenarioService');
const ResponseHelper = require('../utils/response');

class ScenarioController {
  /**
   * Simulate scenario
   */
  async simulate(req, res) {
    try {
      const userId = req.user?.userId || 0;
      const { scenario, parameters } = req.body;
      const result = await ScenarioService.simulateScenario(
        userId,
        scenario,
        parameters
      ).catch(() => ({}));
      return ResponseHelper.success(res, result);
    } catch (error) {
      return ResponseHelper.error(res, error, error.statusCode || 500);
    }
  }

  /**
   * Get scenario types
   */
  async getTypes(req, res) {
    try {
      const types = ScenarioService.getScenarioTypes();
      return ResponseHelper.success(res, types);
    } catch (error) {
      return ResponseHelper.error(res, error);
    }
  }
}

module.exports = new ScenarioController();

