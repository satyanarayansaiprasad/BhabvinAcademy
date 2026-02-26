import HomeConfig from "../../models/HomeConfig.js";

export const getHomeConfig = async (req, res) => {
    try {
        const config = await HomeConfig.findOne({});
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
                studentReviews: [
                    { studentName: "Alex Johnson", reviewText: "The cloud architecture course changed my career path. The instructors are world-class!", studentImage: "https://i.pravatar.cc/150?u=1" },
                    { studentName: "Sarah Chen", reviewText: "Highly professional and easy to follow. I built my first ML model in just 3 weeks.", studentImage: "https://i.pravatar.cc/150?u=2" },
                    { studentName: "Michael Ross", reviewText: "The most premium learning experience I've had online. The community is so active!", studentImage: "https://i.pravatar.cc/150?u=3" },
                    { studentName: "Emily White", reviewText: "I've tried many platforms, but Bhavin Academy's path-based learning is superior.", studentImage: "https://i.pravatar.cc/150?u=4" },
                    { studentName: "David Kim", reviewText: "The cyber security module is intense and incredibly practical. Highly recommend it.", studentImage: "https://i.pravatar.cc/150?u=5" },
                    { studentName: "Sofia Garcia", reviewText: "User interface mastery changed how I approach design. My portfolio looks amazing now!", studentImage: "https://i.pravatar.cc/150?u=6" },
                    { studentName: "James Wilson", reviewText: "The real-world projects are where the magic happens. I got a job offer last week!", studentImage: "https://i.pravatar.cc/150?u=7" },
                    { studentName: "Linda Park", reviewText: "The instructors respond so fast to questions. I never felt stuck during the course.", studentImage: "https://i.pravatar.cc/150?u=8" },
                    { studentName: "Robert Taylor", reviewText: "Blockchain depth is impressive. I finally understand the underlying tech properly.", studentImage: "https://i.pravatar.cc/150?u=9" },
                    { studentName: "Maria Silva", reviewText: "The best investment I've made for my professional growth this year.", studentImage: "https://i.pravatar.cc/150?u=10" },
                    { studentName: "Kevin Zhang", reviewText: "Clean, fast UI and high-quality content. Exactly what professional learning should be.", studentImage: "https://i.pravatar.cc/150?u=11" },
                    { studentName: "Anna Berg", reviewText: "The data science track is very comprehensive. Great balance of theory and practice.", studentImage: "https://i.pravatar.cc/150?u=12" },
                    { studentName: "Chris Evans", reviewText: "Web development fundamentals are explained better here than in my college course.", studentImage: "https://i.pravatar.cc/150?u=13" },
                    { studentName: "Jessica Doe", reviewText: "Incredible value for money. The amount of content per course is staggering.", studentImage: "https://i.pravatar.cc/150?u=14" },
                    { studentName: "Tom Hardy", reviewText: "Bhavin Academy sets the bar for online education. Modern, sleek, and effective.", studentImage: "https://i.pravatar.cc/150?u=15" },
                ],
            });
            await defaultConfig.save();
            return res.status(200).json({
                success: true,
                data: defaultConfig,
            });
        }

        if (config && (!config.studentReviews || config.studentReviews.length === 0)) {
            config.studentReviews = [
                { studentName: "Alex Johnson", reviewText: "The cloud architecture course changed my career path. The instructors are world-class!", studentImage: "https://i.pravatar.cc/150?u=1" },
                { studentName: "Sarah Chen", reviewText: "Highly professional and easy to follow. I built my first ML model in just 3 weeks.", studentImage: "https://i.pravatar.cc/150?u=2" },
                { studentName: "Michael Ross", reviewText: "The most premium learning experience I've had online. The community is so active!", studentImage: "https://i.pravatar.cc/150?u=3" },
                { studentName: "Emily White", reviewText: "I've tried many platforms, but Bhavin Academy's path-based learning is superior.", studentImage: "https://i.pravatar.cc/150?u=4" },
                { studentName: "David Kim", reviewText: "The cyber security module is intense and incredibly practical. Highly recommend it.", studentImage: "https://i.pravatar.cc/150?u=5" },
                { studentName: "Sofia Garcia", reviewText: "User interface mastery changed how I approach design. My portfolio looks amazing now!", studentImage: "https://i.pravatar.cc/150?u=6" },
                { studentName: "James Wilson", reviewText: "The real-world projects are where the magic happens. I got a job offer last week!", studentImage: "https://i.pravatar.cc/150?u=7" },
                { studentName: "Linda Park", reviewText: "The instructors respond so fast to questions. I never felt stuck during the course.", studentImage: "https://i.pravatar.cc/150?u=8" },
                { studentName: "Robert Taylor", reviewText: "Blockchain depth is impressive. I finally understand the underlying tech properly.", studentImage: "https://i.pravatar.cc/150?u=9" },
                { studentName: "Maria Silva", reviewText: "The best investment I've made for my professional growth this year.", studentImage: "https://i.pravatar.cc/150?u=10" },
                { studentName: "Kevin Zhang", reviewText: "Clean, fast UI and high-quality content. Exactly what professional learning should be.", studentImage: "https://i.pravatar.cc/150?u=11" },
                { studentName: "Anna Berg", reviewText: "The data science track is very comprehensive. Great balance of theory and practice.", studentImage: "https://i.pravatar.cc/150?u=12" },
                { studentName: "Chris Evans", reviewText: "Web development fundamentals are explained better here than in my college course.", studentImage: "https://i.pravatar.cc/150?u=13" },
                { studentName: "Jessica Doe", reviewText: "Incredible value for money. The amount of content per course is staggering.", studentImage: "https://i.pravatar.cc/150?u=14" },
                { studentName: "Tom Hardy", reviewText: "Bhavin Academy sets the bar for online education. Modern, sleek, and effective.", studentImage: "https://i.pravatar.cc/150?u=15" },
            ];
            await config.save();
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

export const updateHomeConfig = async (req, res) => {
    try {
        const { skillPillars, studentReviews } = req.body;
        let config = await HomeConfig.findOne({});

        if (config) {
            config.skillPillars = skillPillars;
            config.studentReviews = studentReviews;
            await config.save();
        } else {
            config = new HomeConfig({ skillPillars, studentReviews });
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
