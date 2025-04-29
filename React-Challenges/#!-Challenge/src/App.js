import { reduceEachTrailingCommentRange } from "typescript";
import "./styles.css";
import skills from "./data";

function App() {
  return (
    <div className="App">
      <div className="card">
        <Avatar />
        <div className="data">
          <Intro />
          <SkillList skill="html+css" logo="" />
        </div>
      </div>
    </div>
  );
}

function Avatar() {
  return <img className="avatar" src="img.jpg" alt="HarshaVardhan" />;
}

function Intro() {
  return (
    <div>
      <h1>Harsha Vardhan</h1>
      <p>
        Full-stack web developer and teacher at Udemy. When not coding and
        preparing a course, I like to play board games, to cook (and eat), or to
        enjoy the Potugese sun at beach.
      </p>
    </div>
  );
}

function SkillList() {
  return (
    <div className="skill-list">
      {skills.map((skill) => {
        return (
          <Skill
            key={skill.skill}
            skill={skill.skill}
            level={skill.level}
            color={skill.color}
          />
        );
      })}
    </div>
  );
}

function Skill({ skill, level, color }) {
  return (
    <div className="skill" style={{ backgroundColor: color }}>
      <span>{skill}</span>
      <span>
        {level === "advanced" && "💪"}
        {level === "intermediate" && "👍"}
        {level === "beginner" && "👶"}
      </span>
    </div>
  );
}
export default App;
