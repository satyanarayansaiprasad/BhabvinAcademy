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

export const courseLevelOptions = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

export const courseCategories = [
  { id: "microsoft-365", label: "Microsoft 365" },
  { id: "microsoft-azure", label: "Microsoft Azure" },
  { id: "copilot", label: "Copilot" },
  { id: "open-source", label: "Open Source" },
  { id: "networking-basics", label: "Networking Basics" },
  { id: "yoga", label: "Yoga" },
  { id: "health", label: "Health" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "personal-growth", label: "Personal Growth" },
  { id: "art", label: "Art" },
  { id: "books", label: "Books" },
];

export const topLevelCategories = [
  { id: "technology", label: "Technology" },
  { id: "well-being", label: "Well-being" },
  { id: "personal-mastery", label: "Personal Mastery" },
  { id: "creative-arts", label: "Creative Arts" },
];

export const courseSubCategories = {
  technology: [
    { id: "microsoft-365", label: "Microsoft 365" },
    { id: "microsoft-azure", label: "Microsoft Azure" },
    { id: "copilot", label: "Copilot" },
    { id: "open-source", label: "Open Source" },
    { id: "networking-basics", label: "Networking Basics" },
  ],
  "well-being": [
    { id: "yoga", label: "Yoga" },
    { id: "health", label: "Health" },
    { id: "lifestyle", label: "Lifestyle" },
  ],
  "personal-mastery": [
    { id: "personal-growth", label: "Personal Growth" },
  ],
  "creative-arts": [
    { id: "art", label: "Art" },
    { id: "books", label: "Books" },
  ],
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
    label: "Objectives",
    componentType: "textarea",
    type: "text",
    placeholder: "Enter course objectives",
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
  primaryLanguage: languageOptions,
};
