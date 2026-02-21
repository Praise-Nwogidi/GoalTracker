// THEME
const savedTheme=localStorage.getItem('theme');
if(savedTheme==='dark')document.body.classList.add('dark');
function toggleTheme(){
  document.body.classList.toggle('dark');
  localStorage.setItem('theme',document.body.classList.contains('dark')?'dark':'light');
}

// GOALS
let goals=JSON.parse(localStorage.getItem('goals')||'[]');
let streak=parseInt(localStorage.getItem('streak')||0);

function save(){
  localStorage.setItem('goals',JSON.stringify(goals));
  localStorage.setItem('streak',streak);
}

function addGoal(){
  const name=goalName.value;
  const deadline=goalDeadline.value;
  if(!name)return;
  goals.push({name,progress:0,deadline});
  goalName.value='';goalDeadline.value='';
  streak++;
  markActivity();
  save();render();drawChart();checkDeadlines();
}

function update(i,val){
  goals[i].progress=val;
  markActivity();
  save();render();drawChart();
}

function removeGoal(i){
  goals.splice(i,1);
  save();render();drawChart();
}

function render(){
  goalList.innerHTML='';
  goals.forEach((g,i)=>{
    const d=document.createElement('div');
    d.className='card goal';
    if(g.progress==100)d.classList.add('complete');
    d.innerHTML=`
      <h4>${g.name}</h4>
      <small>Deadline: ${g.deadline||'—'}</small>
      <input type="range" min="0" max="100" value="${g.progress}" oninput="update(${i},this.value)">
      <div class="progress"><div class="bar" style="width:${g.progress}%"></div></div>
      <small>${g.progress}% complete</small>
      <button class="btn outline" onclick="removeGoal(${i})">Delete</button>
    `;
    goalList.appendChild(d);
  });
  document.getElementById('streak').innerText=streak;
}

// DEADLINE REMINDER
function checkDeadlines(){
  const today=new Date().toISOString().split('T')[0];
  goals.forEach(g=>{
    if(g.deadline===today && g.progress<100){
      alert(`Reminder: Goal "${g.name}" is due today!`);
    }
  });
}

// CHART (PURE CANVAS)
function drawChart(){
  const c=document.getElementById('chart');
  const ctx=c.getContext('2d');
  ctx.clearRect(0,0,c.width,c.height);
  const vals=goals.map(g=>g.progress);
  const w=c.width/(vals.length||1);
  vals.forEach((v,i)=>{
    ctx.fillStyle='#6c63ff';
    ctx.fillRect(i*w,c.height,(w-10),-(v*2));
  });
}
// DASHBOARD UPDATE
function updateDashboard(){
  const total=goals.length;
  const completed=goals.filter(g=>g.progress==100).length;
  const active=total-completed;
  const avg=total
    ? Math.round(goals.reduce((a,b)=>a+Number(b.progress),0)/total)
    : 0;

  totalGoals.innerText=total;
  completedGoals.innerText=completed;
  activeGoals.innerText=active;
  avgProgress.innerText=avg;
}

// HEATMAP
let activity=JSON.parse(localStorage.getItem('activity')||'{}');

function markActivity(){
  const today=new Date().toISOString().split('T')[0];
  activity[today]=(activity[today]||0)+1;
  localStorage.setItem('activity',JSON.stringify(activity));
}

function renderHeatmap(){
  heatmap.innerHTML='';
  const days=Object.keys(activity).slice(-56);
  days.forEach(d=>{
    const v=activity[d];
    const div=document.createElement('div');
    div.className='heat '+(v>3?'l3':v>2?'l2':v>1?'l1':'');
    div.title=`${d}: ${v} actions`;
    heatmap.appendChild(div);
  });
}


render();drawChart();checkDeadlines();updateDashboard();renderHeatmap();

