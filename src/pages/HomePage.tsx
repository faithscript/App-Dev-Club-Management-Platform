import React from 'react'
import '../styles/Homepage.css';
import start from '../images/start.png';

function Home() {
    const handleClick = () => {
        // autoscroll to the about section
        const aboutSection = document.getElementById("about");
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: "smooth" });
        } else {
            console.log("About section not found");
        }
    };

    return (
        <div className="home">
            <section className="cover" id="cover">
                <h1>PROJECT NAME</h1>
                <img 
                    onClick={handleClick}
                    id="start-button"
                    src={start}
                />
            </section>
            <section className="about" id="about">
                <h2>USER MANUAL</h2>
                <p className="desc">
                    Our web app allows you to create and manage your mentor group's bucket list, 
                    whether it's for productivity goals, fun team bonding activities, or both! 
                    Each group can add their unique tasks and challenges to their bucket list, 
                    and by completing them, you'll earn points—one point per completed item. 
                    Not only can you track your group’s progress, but you can also explore other 
                    groups' bucket lists for inspiration or even some friendly competition!
                    <br />
                    <br />
                </p>

                <p className="header"> KEY FEATURES: </p>
                <p className="desc">
                    🏆 LEADERBOARD: Stay motivated by tracking your group's progress in real-time and seeing how you match up with others! The leaderboard ranks teams based on the points they earn by completing bucket list items.
                    <br /><br /> 🫂 VIEW GROUPS: View all the members of each mentor group.
                    <br /><br /> 📝 BUCKET LISTS: View other groups' bucket lists and update your own to stay organized and inspired with new goals.
                    <br />
                    <br />
                </p>

                <p className="header"> HOW IT WORKS: </p>
                <p className="desc">
                    ✍️ ADD TASKS: Add any fun or productive activities to your group’s bucket list, such as “Go over resumes” or “Go for a team hike.”
                    <br /><br /> 🪙 EARN POINTS: Every time you complete a task, you earn one point.
                    <br /><br /> ✨ COMPETE & INSPIRE: View the bucket lists of other groups to see what they're up to, get inspired, and keep an eye on how you're ranking on the leaderboard!
                    <br />
                    <br />
                    <br />
                </p>
            </section>
        </div>          
    )
}

export default Home