export const signUpFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    type: "text",
    componentType: "input",
  },
  {
    name: "userFullName",
    label: "Full Name",
    placeholder: "Enter your full name",
    type: "text",
    componentType: "input",
  },
  {
    name: "userEmail",
    label: "User Email",
    placeholder: "Enter your user email",
    type: "email",
    componentType: "input",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    type: "password",
    componentType: "input",
  },
  {
    name: "role",
    label: "Role",
    placeholder: "",
    type: "text",
    componentType: "select",
    options: [{ id: "student", label: "Student" }],
  },
];

export const signInFormControls = [
  {
    name: "userEmail",
    label: "User Email",
    placeholder: "Enter your user email",
    type: "email",
    componentType: "input",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    type: "password",
    componentType: "input",
  },
];

export const initialSignInFormData = {
  userEmail: "",
  password: "",
};

export const initialSignUpFormData = {
  userName: "",
  userFullName: "",
  userEmail: "",
  password: "",
  role: "student",
};

export const languageOptions = [
  { id: "english", label: "English" },
  { id: "spanish", label: "Spanish" },
  { id: "french", label: "French" },
  { id: "german", label: "German" },
  { id: "chinese", label: "Chinese" },
  { id: "japanese", label: "Japanese" },
  { id: "korean", label: "Korean" },
  { id: "portuguese", label: "Portuguese" },
  { id: "arabic", label: "Arabic" },
  { id: "russian", label: "Russian" },
];

export const languages = languageOptions;

export const courseLevelOptions = [
  { id: "Beginner", label: "Beginner" },
  { id: "Intermediate", label: "Intermediate" },
  { id: "Advanced", label: "Advanced" },
  { id: "All Levels", label: "All Levels" },
];

export const courseLevels = courseLevelOptions;

export const courseCategories = [
  { id: "microsoft", label: "Microsoft" },
  { id: "linux", label: "Linux" },
  { id: "networking", label: "Networking" },
  { id: "cloud", label: "Cloud" },
  { id: "security", label: "Security" },
];

export const topLevelCategories = [
  { id: "technology", label: "Technology" },
];

export const courseSubCategories = {
  technology: courseCategories,
};

export const courseLandingPageFormControls = [
  {
    name: "title",
    label: "Title",
    componentType: "input",
    type: "text",
    placeholder: "Enter course title",
  },
  {
    name: "category",
    label: "Category",
    componentType: "select",
    type: "text",
    placeholder: "",
    options: courseCategories,
  },
  {
    name: "level",
    label: "Level",
    componentType: "select",
    type: "text",
    placeholder: "",
    options: courseLevelOptions,
  },
  {
    name: "primaryLanguage",
    label: "Primary Language",
    componentType: "select",
    type: "text",
    placeholder: "",
    options: languageOptions,
  },
  {
    name: "accessType",
    label: "Access Period",
    componentType: "select",
    type: "text",
    placeholder: "",
    options: [
      { id: "Lifetime Access", label: "Lifetime Access" },
      { id: "1 Year Access", label: "1 Year Access" },
      { id: "2 Year Access", label: "2 Year Access" },
      { id: "5 Year Access", label: "5 Year Access" },
    ],
  },
  {
    name: "subtitle",
    label: "Subtitle",
    componentType: "input",
    type: "text",
    placeholder: "Enter course subtitle",
  },
  {
    name: "description",
    label: "Description",
    componentType: "textarea",
    type: "text",
    placeholder: "Enter course description",
  },
  {
    name: "pricing",
    label: "Pricing",
    componentType: "input",
    type: "number",
    placeholder: "Enter course pricing",
  },
  {
    name: "objectives",
    label: "What you'll learn",
    componentType: "textarea",
    type: "text",
    placeholder: "Enter course what you'll learn",
  },
  {
    name: "welcomeMessage",
    label: "Welcome Message",
    componentType: "textarea",
    placeholder: "Welcome message for students",
  },
  {
    name: "image",
    label: "Course Image URL",
    componentType: "input",
    type: "text",
    placeholder: "Enter course image URL (optional if uploading)",
  },
];

export const courseLandingInitialFormData = {
  title: "",
  category: "",
  level: "",
  primaryLanguage: "",
  subtitle: "",
  description: "",
  pricing: "",
  objectives: "",
  welcomeMessage: "",
  image: "",
  accessType: "Lifetime Access",
};

export const courseCurriculumInitialFormData = [
  {
    id: Date.now(),
    title: "",
    videoUrl: "",
    freePreview: false,
    public_id: "",
    videoSource: "upload",
    notes: "",
    links: [],
    pdfs: [],
  },
];

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const filterOptions = {
  category: courseCategories,
  level: courseLevelOptions,
};
