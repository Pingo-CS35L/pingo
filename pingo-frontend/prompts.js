const movie_prompts = [
    "Do a famous pose from Titanic",
    "Do a famous pose from Lion King",
    "Do a famous pose from Home Alone", 
    "Do a famous pose from The Matrix", 
    "Do a famous pose from The Gladiator", 
    "Do a Batman Pose", 
    "Do a Superman Pose", 
    "Do a Spiderman pose", 
    "Do a Iron Man Pose", 
    "Do a Hulk Pose", 
    "Do a Hawkeye Pose", 
    "Do a Black Widow Pose", 
    "Do a Flash Pose", 
    "Do a Wonder Woman Pose", 
    "Do a famous pose from The Ghostbusters", 
    "Reenact a Star Wars Scene",
    "Reenact a Frozen scene"
];

const dance_prompts = [
    "Do the griddy",
    "Do the Macarena", 
    "Do the Orange Justice", 
    "Do the Hype", 
    "Do Take the L", 
    "Do the Salsa", 
    "Do the Flamenco", 
    "Do Natu Natu", 
    "Do Couple Dancing",
    "Do the Chicken Dance",
    "Do the Robot Dance",
    "Do the Electric Slide",
    "Do the Twist",
    "Do the Moonwalk",
];
const situations_prompts = [
    "Your reaction to your dog eating your hw",
    "What you would do if you were lost in space",
    "How you would react if someone stole your favorite book",
    "Your reaction when you hit a tough fade away over someone",
];
const celebrations_prompts = [
    "Do a LeBron Celebration",
    "De a Curry Celebration",
    "Do a Ronaldo Celebration",
    "Do a Messi Celebration",
    "Do a Tom Brady Celebration",
    "Do a Gronk Celebration",
    "Do a Serena Williams Celebration"
];
const clothing_prompts = [
    "Date Fit",
    "Work Out Fit",
    "Sleep Fit",
    "Going out Fit",
    "Party Fit",
    "Work Fit",
    "Hiking Fit",
    "Casual Fit",
    "Formal Fit",
];

const master_prompts = [movie_prompts, dance_prompts, situations_prompts, celebrations_prompts, clothing_prompts];

function pickPrompts() {
    let prompt_arr = [];
    while (prompt_arr.length < 9) {
        let num = Math.floor(Math.random() * 5);
        let promptsArr = master_prompts[num];

        prompt_arr.push(promptsArr[Math.floor(Math.random() * promptsArr.length)]);
    }
    return prompt_arr;
}

export { pickPrompts };