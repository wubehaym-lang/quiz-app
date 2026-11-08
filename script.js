const timerBox = document.querySelector('#time'); 
const popPup = document.querySelector('.pop-pare');
const reset = document.querySelector('.reset');
const scoreDis =  document.getElementById('score');
const percent = document.getElementById('percent');
const buttonBox = document.querySelector('.buttonBox');
const reviewQuestion = document.querySelector('#reviewQuestion');

const questionBank = [{

  question: 'Capital citiy of Ethiopia',
  options: [{
      answer:'Dilla',
      ans: false,
      
    },{
      answer:'Hawassa',
      ans: false,
      
    }, {
      answer: 'Bole',
      ans: false,
      
    },{ 
      answer: 'Addis Ababa',
      ans: true,
      
    }]
  }, {
  question: 'Capital citiy of Kenya',
  options: [{
      answer:'Asmara',
      ans: false,
      
    },{
      answer:'Nairob', 
      ans: true,
      
    }, {
      answer: 'Asena',
      ans: false,
      
    },{ 
      answer: 'Addis Ababa',
      ans: false,
      
    }]
  }, {
  question: 'One of the following are different',
  options: [{
      answer:'Sudan',
      ans: false,
      
    },{
      answer:'Cairo', 
      ans: true,
      
    }, {
      answer: 'Kenya',
      ans: false,
      
    },{ 
      answer: 'Ethiopia',
      ans: false,
      
    }]
  }];

let answers = [];
let questNo = 0;
let score = 0;
let completed = false;
let time = 3;
let timerId;
let popUpBox = false;


generateHtml();
runTime();

function runTime(){
  timerId = setInterval(()=>{
      
    if(time === 0 && completed === false){
      calculateScore();
      clearInterval(timerId);
    } else if(time <=  6){
      timerBox.classList.add('ending');
    }

    if ( time > 0){
    time--; 
    } else{
      clearInterval(timerId);
    }

    renderTime();
  }, 1000);
}

function renderTime(){
  timerBox.innerText = `00:${time < 10 ? '0'+time : time}`;
}

function generateHtml(){
  let optionHtml = '';
  let questionBar = '';

  questionBank[questNo].options.forEach((option, index)=> {
    optionHtml += `
      <div class="option ${isCompleted(option.ans)}" data-option-id="${index}">
        <div class="optionSelec ${isSelected(questNo, index)}"></div>
        <span>${option.answer}</span>
      </div> 
      `;
  });

  document.querySelector('.questioBox').innerHTML = `
    <div class="questio" id="question">
    <span>${questNo + 1}</span> ${questionBank[questNo].question}
    </div>

    <div id="optionBox">
      ${optionHtml}
    </div>
  `;

  questionBank.forEach((question, index)=> {
    questionBar += `
    <div class="navBtns ${isTheUserCorrect(index)} navBtns${index} ${isAnswered(index)=== true ? `answered` :''}  ${questNo === index ? 'current' : ''}" data-quest-nu="${index}"></div>`;
  });
  
  document.querySelector('.nav').innerHTML = `
    <div class="detail">Question ${questNo + 1} of ${questionBank.length}</span></div>
    <div class="boxs">
      ${questionBar}
    </div>
  `;
  
  buttonBox.innerHTML = ` 
    <button id="previous" ${questNo === 0 ? 'Disabled' : ''} 
      ${questNo === 0 ? `style="opacity: 0; cursor: initial"`: ''}>
      Previous
    </button>

    <button id="next" class="${isAnswered(questNo) === true ? '' : 'notAnswered' }" 

      ${isAnswered(questNo) === true ? '' : 'disabled' }>

      ${questNo === questionBank.length -1 ? 'Complete' : 'Next'}
    </button>`;
  addId();
}




function addId(){
  const nextBtn = document.getElementById('next');
  const prevBtn = document.getElementById('previous');

  document.querySelectorAll('.option').forEach((optionBtn)=> {
    if(completed === false){
      optionBtn.addEventListener('click', ()=> {
        const optionId = Number(optionBtn.dataset.optionId);

        let matchingQuest = '';

        answers.forEach((answer)=> {
          if(answer.question === questNo){
            matchingQuest = answer;
          }
        });
          
        if(matchingQuest.question === questNo){
          matchingQuest.selected = optionId;
        } else{
          answers.push({
            question: questNo,
            selected: optionId,
          });
        }

        generateHtml();
      });

    }
  });

  nextBtn.addEventListener('click', ()=> { nextQue() });

  prevBtn.addEventListener('click', ()=> { prevQue()});

  reset.addEventListener('click', ()=> { resetFunc()});

  reviewQuestion.addEventListener('click', ()=>{
    popPup.classList.add('hidden');
    popUpBox = false;

    generateHtml();

  });


  document.querySelectorAll('.navBtns').forEach((navBtn)=> {
    navBtn.addEventListener('click', ()=>{
      const {questNu} = navBtn.dataset;
        questNo = Number(questNu);

      generateHtml();
    });
  });
}

document.body.addEventListener('keyup', (event)=> {

  if(event.key === 'ArrowRight' && popUpBox === false){
    nextQue();
  } else if(event.key === 'ArrowLeft' && popUpBox === false){
    prevQue();
  } else if(event.key === 'Enter' && completed === true){
    resetFunc();
  }
});


function nextQue(){

  if(questNo < questionBank.length -1){
    questNo++;
    generateHtml();
  } else if(allQuestionisAnswered() || completed === true){
    calculateScore();
  } 
}

function prevQue(){
  if(questNo > 0){
    questNo--;
  }
  generateHtml()
}

function resetFunc(){
  popUpBox = false;
  popPup.classList.add('hidden');
  score = 0;
  questNo = 0;
  time = 60;
  answers = [];
  completed = false;
  clearInterval(timerId);
  runTime();
  renderTime();
  timerBox.classList.remove('ending');
  generateHtml();
}


function isSelected(questNo, optionId){
  let check = '';
  let matchingOpti;
    
    answers.forEach((answer)=> {
      if(questNo === answer.question){
        matchingOpti = answer.selected;
      }
    });
    
    if(matchingOpti === optionId){
      check = 'selected';
    } else{
      check = '';
    }

  return check;
}

function calculateScore(){
  
  popPup.classList.remove('hidden');
  popUpBox = true;

  if(completed===false){
    completed = true;

    answers.forEach((answer)=> {
      if(questionBank[answer.question].options[answer.selected].ans === true){
        score++;
      }
    });

      const percentage = score / questionBank.length * 100;

      scoreDis.innerText = `${score}/${questionBank.length}`;
      percent.innerText = `${Math.round(percentage)}%`;
      clearInterval(timerId);
  }
}

function isAnswered(Quenumb){
  let answered = false;
  answers.forEach((answer)=>{
    if(answer.question === Quenumb){
      answered = true;
    }
  })
  return answered || completed === true;
}

function allQuestionisAnswered(){
    return questionBank.length === answers.length
}

function isCompleted(optionValue){
  let answer = '';
  if(completed === true){
    if(optionValue === true){
      answer = 'correct';
    } else{
      answer = 'incorrect';
    }
  }
  return answer;
}


function isTheUserCorrect(questionNum){
  let result = '';

  if(completed === true){

    answers.forEach((answer)=> {
      if(answer.question === questionNum){
        if(questionBank[questionNum].options[answer.selected].ans === true){
          result = 'correctUser';
        } else{
          result = 'incorrectUser';
        }
      }
    });

  }

  return result;
}