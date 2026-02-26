const HomeConfig = require("../../models/HomeConfig");

const getHomeConfig = async (req, res) => {
    try {
        const config = await HomeConfig.findOne({}).populate('featuredCourseSections.trending featuredCourseSections.mostDemanded featuredCourseSections.recent');
        if (!config) {
            // Default initial config if none exists
            const defaultConfig = new HomeConfig({
                skillPillars: [
                    { label: "Web Development" },
                    { label: "Cloud Architecture" },
                    { label: "Machine Learning" },
                    { label: "UI/UX Mastery" },
                    { label: "Cyber Security" },
                    { label: "Data Science" },
                ],
                studentReviews: [],
            });
            await defaultConfig.save();
            return res.status(200).json({
                success: true,
                data: defaultConfig,
            });
        }

        res.status(200).json({
            success: true,
            data: config,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

const updateHomeConfig = async (req, res) => {
    try {
        const { skillPillars, studentReviews, featuredCourseSections } = req.body;
        let config = await HomeConfig.findOne({});

        if (config) {
            config.skillPillars = skillPillars;
            config.studentReviews = studentReviews;
            config.featuredCourseSections = featuredCourseSections;
            config.categories = req.body.categories;
            await config.save();
        } else {
            config = new HomeConfig({ skillPillars, studentReviews, featuredCourseSections, categories: req.body.categories });
            await config.save();
        }

        res.status(200).json({
            success: true,
            message: "Home configuration updated successfully",
            data: config,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

module.exports = { getHomeConfig, updateHomeConfig };
