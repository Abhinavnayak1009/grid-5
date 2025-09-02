
    // Game state variables
    let gameActive = false;
    let gamePaused = false;
    let level = 1;
    let sequenceStep = 0;
    let totalSteps = 8; // 3 balls + 3 symmetries
    let gameTimer;
    let timeLeft = 300; // 5 minutes
    let currentProgress = 1;
    let maxProgress = 6;

    // LEVEL PROGRESSION VARIABLES
    let levelAdvancementThreshold = 70; // Minimum overall score needed to advance level
    let maxLevel = 100; // Maximum level in the game

    // SEQUENCE-BASED tracking
    let ballSequence = [];
    let shownSequence = [];
    let symmetryResults = [];
    //let ballDisplayTime = 1000;
    let ballDisplayTime = 1500;
    let symmetryTime = 3000;
    let selectedBallsInOrder = []; // Track selection order during final phase
    let inSelectionPhase = false;

    // Symmetry data
    let symmetryTimer;
    let symmetryTimeLeft = 0;
    let currentSymmetryPattern = null;

    // Expanded symmetry patterns
    const symmetryPatterns = [
      {
        pattern: [1,1,1,1,1,0,1,1,1,1,1,
                 1,0,0,0,0,0,1,0,1,0,1,
                 1,0,1,0,0,0,1,0,1,0,1,
                 1,0,0,0,0,0,1,0,1,1,1,
                 1,1,1,1,1,0,1,1,0,0,1],
        symmetric: false,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,1,1,1,1,0,1,1,1,1,1,
                 1,0,0,0,0,0,0,0,0,0,1,
                 1,1,1,1,1,0,1,1,1,1,1,
                 0,0,0,0,1,0,1,0,0,0,0,
                 1,1,1,1,1,0,1,1,1,1,1],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
       {
        pattern: [1,1,1,1,1,0,1,1,1,1,1,
                 1,0,0,0,0,0,1,0,1,0,1,
                 1,0,1,0,0,0,1,0,1,0,1,
                 1,0,0,0,0,0,1,0,1,1,1,
                 1,1,1,1,1,0,1,1,0,0,1],
        symmetric: false,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,1,1,1,1,0,1,1,1,1,1,
                 1,0,0,0,0,0,0,0,0,0,1,
                 1,1,1,1,1,0,1,1,1,1,1,
                 0,0,0,0,1,0,1,0,0,0,0,
                 1,1,1,1,1,0,1,1,1,1,1],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,0,1,0,1,0,1,0,1,0,1,
                 0,1,0,1,0,0,0,1,0,1,0,
                 1,0,1,0,1,0,1,0,1,0,1,
                 0,1,0,1,0,0,0,1,0,1,0,
                 1,0,1,0,1,0,1,0,1,0,1],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,1,0,0,1,0,1,0,0,1,1,
                 0,1,1,0,0,0,0,0,1,1,0,
                 1,0,1,1,0,0,0,1,1,0,1,
                 0,0,1,0,1,0,1,0,1,0,0,
                 1,1,0,0,1,0,1,0,0,1,1],
        symmetric: false,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,1,1,0,0,0,0,0,1,1,1,
                 1,0,0,1,0,0,0,1,0,0,1,
                 1,0,0,0,1,0,1,0,0,0,1,
                 1,0,0,1,0,0,0,1,0,0,1,
                 1,1,1,0,0,0,0,0,1,1,1],
        symmetric: true,
        question: "Perfect mirror symmetry?"
      },
      {
        pattern: [0,1,1,1,0,0,0,1,1,1,1,
                 1,0,0,0,1,0,1,0,0,0,1,
                 1,1,0,1,1,0,1,1,0,1,1,
                 1,0,0,0,1,0,1,0,0,0,1,
                 0,1,1,1,0,0,0,1,1,1,0],
        symmetric: false,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,0,0,0,1,0,1,0,0,0,1,
                 0,1,1,1,0,0,0,1,1,1,0,
                 0,1,0,1,0,0,0,1,0,1,0,
                 0,1,1,1,0,0,0,1,1,1,0,
                 1,0,0,0,1,0,1,0,0,0,1],
        symmetric: true,
        question: "Is this symmetric?"
      },
      {
        pattern: [1,1,0,1,0,0,0,1,0,1,1,
                 0,0,1,0,1,0,1,0,1,0,0,
                 1,0,0,1,0,0,0,1,0,0,1,
                 0,0,1,0,1,0,1,0,1,0,0,
                 1,1,0,1,0,0,0,1,0,1,1],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [0,0,1,1,1,0,1,1,1,0,1,
                 0,1,0,0,0,0,0,0,0,1,0,
                 1,0,1,1,0,0,0,1,1,0,1,
                 0,1,0,0,0,0,0,0,0,1,0,
                 0,0,1,1,1,0,1,1,1,0,0],
        symmetric: false,
        question: "Is this pattern symmetric?"
      },
      {
        pattern: [1,0,1,1,0,0,0,1,1,0,1,
                 0,0,0,1,1,0,1,1,0,0,0,
                 1,1,0,0,1,0,1,0,0,1,1,
                 0,0,0,1,1,0,1,1,0,0,0,
                 1,0,1,1,0,0,0,1,1,0,1],
        symmetric: true,
        question: "Perfect mirror symmetry?"
      },
      {
        pattern: [0,1,0,1,0,0,0,1,0,1,0,
                 1,0,1,0,1,0,1,0,1,0,1,
                 0,1,0,1,0,0,0,1,0,1,0,
                 1,0,1,0,1,0,1,0,1,0,1,
                 0,1,0,1,0,0,0,1,0,1,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,1,1,0,1,0,1,0,1,1,0,
                 0,0,1,1,0,0,0,1,1,0,0,
                 1,0,0,1,1,0,1,1,0,0,1,
                 0,0,1,1,0,0,0,1,1,0,0,
                 1,1,1,0,1,0,1,0,1,1,1],
        symmetric: false,
        question: "Is this symmetric?"
      },
      {
        pattern: [0,0,0,1,1,0,1,1,0,0,0,
                 0,1,1,0,1,0,1,0,1,1,0,
                 1,0,1,1,0,0,0,1,1,0,1,
                 0,1,1,0,1,0,1,0,1,1,0,
                 0,0,0,1,1,0,1,1,0,0,0],
        symmetric: true,
        question: "Perfect mirror symmetry?"
      },
      {
        pattern: [1,0,0,1,1,0,1,1,0,0,1,
                 0,1,0,0,1,0,1,0,0,1,0,
                 0,0,1,1,0,0,0,1,1,0,0,
                 0,1,0,0,1,0,1,0,0,1,0,
                 1,0,0,1,1,0,1,1,0,1,1],
        symmetric: false,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,1,0,0,0,0,0,0,0,1,1,
                 1,0,1,0,1,0,1,0,1,0,1,
                 0,1,0,1,0,0,0,1,0,1,0,
                 1,0,1,0,1,0,1,0,1,0,1,
                 1,1,0,0,0,0,0,0,0,1,1],
        symmetric: true,
        question: "Is this symmetric?"
      },
      {
        pattern: [0,1,1,0,1,0,1,0,1,1,0,
                 1,0,0,1,0,0,0,1,0,0,1,
                 1,0,1,0,0,0,0,0,1,0,1,
                 1,0,0,1,0,0,0,1,0,0,1,
                 0,1,1,0,1,0,1,0,1,1,0],
        symmetric: true,
        question: "Perfect mirror symmetry?"
      },
      {
        pattern: [1,0,1,0,0,0,0,0,1,0,0,
                 0,1,0,1,1,0,1,1,0,1,0,
                 1,0,0,0,1,0,1,0,0,0,1,
                 0,1,0,1,1,0,1,1,0,1,0,
                 1,0,1,0,0,0,0,0,1,0,1],
        symmetric: false,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [0,0,1,1,0,0,0,1,1,0,0,
                 0,1,0,0,1,0,1,0,0,1,0,
                 1,0,0,1,1,0,1,1,0,0,1,
                 0,1,0,0,1,0,1,0,0,1,0,
                 0,0,1,1,0,0,0,1,1,0,0],
        symmetric: true,
        question: "Is this pattern symmetric?"
      },
      {
        pattern: [1,1,0,1,0,0,0,1,0,1,1,
                 0,0,0,0,1,0,1,0,0,0,0,
                 1,0,1,1,0,0,0,1,1,0,1,
                 0,0,0,0,1,0,1,0,0,0,0,
                 1,1,0,1,0,0,0,0,0,1,1],
        symmetric: false,
        question: "Perfect mirror symmetry?"
      },
      {
        pattern: [0,1,0,0,1,0,1,0,0,1,0,
                 1,0,1,0,0,0,0,0,1,0,1,
                 0,1,0,1,1,0,1,1,0,1,0,
                 1,0,1,0,0,0,0,0,1,0,1,
                 0,1,0,0,1,0,1,0,0,1,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,0,1,0,1,0,1,0,1,0,1,
                 0,1,0,1,0,0,0,1,0,1,0,
                 1,0,1,0,1,0,1,0,1,0,1,
                 0,1,0,1,0,0,0,1,0,1,0,
                 1,0,1,0,1,0,1,0,1,0,1],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,1,0,0,1,0,1,0,0,1,1,
                 0,1,1,0,0,0,0,0,1,1,0,
                 1,0,1,1,0,0,0,1,1,0,1,
                 0,0,1,0,1,0,1,0,1,0,0,
                 1,1,0,0,1,0,1,0,0,1,1],
        symmetric: false,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,1,1,0,0,0,0,0,1,1,1,
                 1,0,0,1,0,0,0,1,0,0,1,
                 1,0,0,0,1,0,1,0,0,0,1,
                 1,0,0,1,0,0,0,1,0,0,1,
                 1,1,1,0,0,0,0,0,1,1,1],
        symmetric: true,
        question: "Perfect mirror symmetry?"
      },
      {
        pattern: [0,1,1,1,0,0,0,1,1,1,1,
                 1,0,0,0,1,0,1,0,0,0,1,
                 1,1,0,1,1,0,1,1,0,1,1,
                 1,0,0,0,1,0,1,0,0,0,1,
                 0,1,1,1,0,0,0,1,1,1,0],
        symmetric: false,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,0,0,0,1,0,1,0,0,0,1,
                 0,1,1,1,0,0,0,1,1,1,0,
                 0,1,0,1,0,0,0,1,0,1,0,
                 0,1,1,1,0,0,0,1,1,1,0,
                 1,0,0,0,1,0,1,0,0,0,1],
        symmetric: true,
        question: "Is this symmetric?"
      },


      {
        pattern: [1,0,0,1,0,1,0,1,0,0,1,1,0,0,0,1,0,1,0,0,0,1,1,1,0,0,1,1,1,0,0,1,1,0,0,0,1,1,0,1,1,0,0,0,0,0,1,1,0,0,0,1,1,0,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [0,1,1,0,0,0,0,0,1,1,0,0,1,1,1,0,1,0,1,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
        symmetric: true,
        question: "Mirror symmetry across red line?"
        },
      {
        pattern: [0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"    },
      {
        pattern: [0,0,0,1,0,0,0,1,0,0,0,1,1,0,0,0,1,0,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0,1,1,0,1,0,1,0,1,0,1,1,0,1,1,0,1,1,1,0,1,1,0],
        symmetric: true,
        question: "Mirror symmetry across```d line?"
      },
      {
        pattern: [0,1,0,1,1,0,1,1,0,1,0,0,1,0,0,1,0,1,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,0,1,1,1,1,1,1,1,0,0,0,1,0,0,1,1,1,0,0,1,0],
        symmetric: true,
        question: "Mirror symmetry across```d line?"
      },
      {
        pattern: [1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,0,0,0,0,0,1,1,1,0,0,0,0,1,0,0,0,1,0,1,0,0,0,1,1,1,0,0,1,1,1,0,0,1,1],
        symmetric: true,
        question: "Mirror symmetry across red line?"    
        },
      {
        pattern: [1,0,1,1,0,1,0,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,0,0,1,0,0,0,1,1,0,0,1,1,1,1,1,1,1,0,0,0,0,0,1,0,0,0,1,0,0,0],
        symmetric: true,
        question: "Mirror symmetry across```d line?"
      },
      {
        pattern: [1,0,1,0,0,1,0,0,1,0,1,0,1,1,0,1,0,1,0,1,1,0,0,0,0,0,1,1,1,0,0,0,0,1,0,1,1,0,1,0,1,1,0,1,1,1,0,0,0,0,0,0,0,1,1],
        symmetric: true,
        question: "Mirror symmetry across```d line?"
      },
      {
        pattern: [1,1,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,1,1,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,1,1,1,0,0,0,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1],
        symmetric: true,
        question: "Mirror symmetry across red line?"    },
      {
        pattern: [1,1,1,0,0,1,0,0,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,0,1,0,0,0,0,0,1,0,1,0,0,1,1,1,1,1,1,1,0,0,1,1,0,0,1,1,1,0,0,1,1],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,1,1,1,1,0,1,1,1,1,1,1,0,0,1,0,1,0,1,0,0,1,1,0,1,1,0,0,0,1,1,0,1,0,0,1,0,1,1,1,0,1,0,0,0,0,1,0,1,0,1,0,1,0,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [0,0,0,1,0,1,0,1,0,0,0,0,1,1,0,1,0,1,0,1,1,0,1,0,1,1,0,0,0,1,1,0,1,0,0,0,1,1,0,1,1,0,0,0,1,1,0,0,0,1,0,0,0,1,1],
        symmetric: true,
        question: "Mirror symmetry across```d line?"
      },
      {
        pattern: [0,1,1,0,1,0,1,0,1,1,0,0,1,1,0,0,1,0,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,1,0,1,0,0,0,1,0,1,1,0,1,0,0,0,1,0,0,0,1,0],
        symmetric: true,
        question: "Mirror symmetry across```d line?"
      },
      {
        pattern: [0,1,0,0,1,0,1,0,0,1,0,0,1,1,1,0,1,0,1,1,1,0,0,1,0,1,1,0,1,1,0,1,0,0,0,0,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,0,1,1,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,0,0,0,1,1,1,1,1,0,0,0,1,0,1,0,0,0,0,0,1,0,1,0,0,0,1,1,1,1,1,0,0,0],
        symmetric: true,
        question: "Mirror symmetry across```d line?"
      },
      {
        pattern: [0,1,1,1,0,0,0,1,1,1,0,0,1,0,1,1,0,1,1,0,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,0,1,0,1,0,0,1,1,0,0,1,1,0,0,0,1,1,0,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"    },
      {
        pattern: [1,0,1,0,1,0,1,0,1,0,1,1,0,1,0,1,0,1,0,1,0,1,1,0,0,1,0,1,0,1,0,0,1,1,0,0,1,0,0,0,1,0,0,1,1,1,1,1,0,0,0,1,1,1,1],
        symmetric: true,
        question: "Mirror symmetry across```d line?"
      },
      {
        pattern: [0,1,1,1,1,1,1,1,1,1,0,1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,0,1,1,0,1,1],
        symmetric: true,
        question: "Mirror symmetry across red line?"    },
      {
        pattern: [1,1,1,0,0,0,0,0,1,1,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,1,1,1,1,0,1,1,1,1,1],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,0,1,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,0,1,0,0,1,1,1,1,1,0,0,1,1,1,0,0,1,1,1,0,1,1,1,1,1,1,1,0,1],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,0,1,1,0,1,0,1,0,1,1,0,1,0,1,0,1,0,1,0,1,0,1],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [0,1,1,0,0,0,0,0,1,1,0,0,1,1,0,1,0,1,0,1,1,0,0,1,0,0,1,1,1,0,0,1,0,1,1,1,0,0,0,0,0,1,1,1,0,1,1,0,0,0,0,0,1,1,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"   },
      {
        pattern: [1,1,1,1,0,0,0,1,1,1,1,1,0,1,0,0,1,0,0,1,0,1,0,0,0,0,1,1,1,0,0,0,0,1,0,0,0,1,0,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1],
        symmetric: true,
        question: "Mirror symmetry across```d line?"
      },
      {
        pattern: [1,1,0,1,0,1,0,1,0,1,1,0,0,0,0,1,0,1,0,0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,0,1,1,1,0,1,0,0,0,1,1,1,0,0,0,1,1,1,0],
        symmetric: true,
        question: "Mirror symmetry across```d line?"
      },
      {
        pattern: [1,0,0,0,0,0,0,0,0,0,1,0,1,1,0,1,1,1,0,1,1,0,1,0,0,1,1,0,1,1,0,0,1,0,1,1,0,0,0,0,0,1,1,0,0,0,1,0,0,1,0,0,1,0,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"   },
      {
        pattern: [0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,1,1,0,1,1,0,0,1,1,1,0,0,1,0,1,0,0,1,1],
        symmetric: true,
        question: "Mirror symmetry across```d line?"
      },
      {
        pattern: [1,0,0,0,1,1,1,0,0,0,1,1,1,0,1,1,1,1,1,0,1,1,0,1,0,1,1,0,1,1,0,1,0,0,1,1,0,1,0,1,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,1,0,1,0,0,0,0,1,1,1,0,1,0,1,0,1,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"   },
      {
        pattern: [1,0,0,1,1,0,1,1,0,0,1,1,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,1,0,1,0,0,0,1,1,0,0,1,0,1,0,0,1,1,1,1,0,0,1,0,1,0,0,1,1],
        symmetric: true,
        question: "Mirror symmetry across```d line?"
      },
      {
        pattern: [0,0,1,1,1,1,1,1,1,0,0,1,0,1,1,1,1,1,1,1,0,1,0,1,0,0,0,1,0,0,0,1,0,0,1,1,1,1,0,1,1,1,1,0,0,0,1,0,0,1,0,0,1,0,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [0,0,1,1,1,1,1,1,1,0,0,1,0,1,0,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,1,0,1,1,1,1,1,0,1,1],
        symmetric: true,
        question: "Mirror symmetry across red line?"    },
      {
        pattern: [1,0,1,0,1,0,1,0,1,0,1,0,0,1,1,0,1,0,1,1,0,0,1,1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,1,0,0,0,0,1,0,0,0,1,1,1,1,1,0,0,0],
        symmetric: true,
        question: "Mirror symmetry across red line"      },
      {
        pattern: [0,1,0,1,0,0,0,1,0,1,0,1,1,1,1,0,0,0,1,1,1,1,0,1,0,0,0,0,0,0,0,1,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
        symmetric: true,
        question: "Mirror symmetry across```d line?"
      },
      {
        pattern: [1,1,0,0,0,1,0,0,0,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,1,0,0,0,1,1,0,1,1,0,1,1,1,0,1,1,1,0,1,0,1,1,0,1,1,1,0,1,1,0],
        symmetric: true,
        question: "Mirror symmetry across```d line?"
      },
      {
        pattern: [1,1,0,1,1,0,1,1,0,1,1,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,1,1,0,1,1,1,0,0,0,0,0,1,0,1,0,1,0,0,0],
        symmetric: true,
        question: "Mirror symmetry across red line"      },
      {
        pattern: [1,0,0,1,1,0,1,1,0,0,1,0,0,1,1,0,0,0,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,0,0,0,0],
        symmetric: true,
        question: "Mirror symmetry across red line"    },
      {
        pattern: [1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,0,0,0,1,0,0,0,1,0,0,0],
        symmetric: true,
        question: "Mirror symmetry across```d line?"
      },
      {
        pattern: [1,1,1,1,0,0,0,1,1,1,1,0,1,0,1,0,0,0,1,0,1,0,1,1,0,0,1,1,1,0,0,1,1,0,0,1,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [0,1,1,0,0,0,0,0,1,1,0,0,0,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,1,0,1,1,0,0,1,1,0,0,0,1,1,0,0],
        symmetric: true,
        question: "Mirror symmetry across red line"      },
      {
        pattern: [1,0,1,0,0,0,0,0,1,0,1,1,0,1,0,0,1,0,0,1,0,1,0,1,0,0,0,1,0,0,0,1,0,1,0,1,1,0,1,0,1,1,0,1,0,1,1,0,1,0,1,0,1,1,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [0,0,1,1,0,0,0,1,1,0,0,0,0,0,1,0,1,0,1,0,0,0,1,1,0,0,0,1,0,0,0,1,1,0,1,0,1,1,0,1,1,0,1,0,0,0,0,1,1,1,1,1,0,0,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [0,0,1,0,0,1,0,0,1,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"    },
      {
        pattern: [1,1,1,0,1,0,1,0,1,1,1,0,1,1,1,1,0,1,1,1,1,0,0,1,1,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,1,1,0,0,0,0],
        symmetric: true,
        question: "Mirror symmetry across red line"     },
      {
        pattern: [1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,0,1,0,0,1,1,1,0,1,0,1,1,1,1,1,0,1,0,0,1,0,1,1,0,1,1,0,1,0],
        symmetric: true,
        question: "Mirror symmetry across red line"      },
      {
        pattern: [1,1,0,0,0,0,0,0,0,1,1,0,0,0,1,0,0,0,1,0,0,0,0,1,1,0,1,0,1,0,1,1,0,1,1,0,0,1,1,1,0,0,1,1,0,1,0,1,0,1,0,1,0,1,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [0,1,1,0,0,0,0,0,1,1,0,0,1,0,0,0,1,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,0,1,0,1,1,0,0,1,0,1,0,0,1,0,0,1,0,1],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,1,0,1,0,1,0,1,0,1,1,0,0,1,0,1,1,1,0,1,0,0,1,0,1,0,1,1,1,0,1,0,1,0,0,0,0,0,1,0,0,0,0,0,1,1,0,1,1,1,1,1,0,1,1],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,0,0,0,0,1,0,0,0,0,1,1,1,1,0,0,0,0,0,1,1,1,1,0,1,0,0,1,0,0,1,0,1,1,1,0,1,0,0,0,1,0,1,1,1,1,0,0,0,1,0,0,0,1,1],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,1,1,0,1,0,1,0,1,1,1,1,0,0,1,1,1,1,1,0,0,1,0,0,1,1,0,0,0,1,1,0,0,0,1,0,0,1,1,1,0,0,1,0,1,1,1,1,1,1,1,1,1,1,1],
        symmetric: true,
        question: "Mirror symmetry across```d line?"
      },
      {
        pattern: [0,1,0,1,1,1,1,1,0,1,0,1,1,0,0,1,0,1,0,0,1,1,0,1,1,0,1,0,1,0,1,1,0,0,0,0,0,1,0,1,0,0,0,0,1,1,0,1,0,1,0,1,0,1,1],
        symmetric: true,
        question: "Mirror symmetry across```d line?"
      },
      {
        pattern: [1,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,1,0,0,1,0,0,1,1,1,1,1,0,1,0,1,0,1,0,1,1,0,1,1,1,0,1,0,1,1,1,0],
        symmetric: true,
        question: "Mirror symmetry across```d line?"
      },
      {
        pattern: [0,1,1,1,0,1,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"    },
      {
        pattern: [0,1,1,0,0,1,0,0,1,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1,0,0,1,0,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [0,0,1,1,1,1,1,1,1,0,0,1,1,0,1,0,0,0,1,0,1,1,1,1,0,1,1,0,1,1,0,1,1,0,0,1,0,1,1,1,0,1,0,0,0,0,0,0,1,0,1,0,0,0,0],
        symmetric: true,
        question: "Mirror symmetry across```d line?"
      },
      {
        pattern: [1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,0,0,0,1,1,0,0,1,0,1,0,1,1,1,0,1,0,1,0,1,0,0,1,1,1,0,0,1,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,0,0,1,0,0,0,1,0,0,1,1,1,1,0,0,0,0,0,1,1,1,0,1,0,0,1,1,1,0,0,1,0,0,0,0,1,0,1,0,1,0,0,0,0,1,1,0,1,0,1,0,1,1,0],
        symmetric: true,
        question: "Mirror symmetry across red line"     },
      {
        pattern: [0,0,0,1,1,1,1,1,0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,1,1,0,0,0,0,0,1,1,0,1,1,0,1,0,0,0,1,0,1,1,0,0,1,0,1,1,1,0,1,0,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [0,1,1,1,0,0,0,1,1,1,0,1,1,1,0,1,0,1,0,1,1,1,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,1,1,1,1,1,0,0,1,1,1,1,1,0,0,1],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,0,0,0,1,1,1,1,0,1,1,1,0,0,0,1,1,1,0,0,0,0,1,1,0,1,1,0,0,0,0,1,1,1,1,0,1,1,1,1,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [0,1,0,0,1,0,1,0,0,1,0,0,1,1,1,1,1,1,1,1,1,0,1,0,0,0,1,0,1,0,0,0,1,1,1,0,1,0,1,0,1,0,1,1,0,0,0,1,1,0,1,1,0,0,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,0,0,0,1,1,1,0,0,0,1,0,1,0,0,1,1,1,0,0,1,0,1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1,1,1,0,1,0,0,1,1,1,0,1,0,1,0,1,1,1],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,1,0,0,0,0,0,0,0,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,0,0,1,0,0,1,1,1,0,1,0,1,1,1,1,1,0,1,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,1,1,0,0,0,0,0,1,1,1,1,1,1,0,0,1,0,0,1,1,1,0,0,1,1,1,1,1,1,1,0,0,1,0,1,1,1,0,1,1,1,0,1,0,1,0,1,1,1,1,1,0,1,0],
        symmetric: true,
        question: "Mirror symmetry across```d line?"
      },
      {
        pattern: [1,1,0,0,1,1,1,0,0,1,1,0,1,1,1,0,1,0,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,1,1,0,0,1,0,1,0,0,1,1,1,1,0,1,0,0,0,1,0,1,1],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,1,1,1,1,1,1,1,1,1,1,0,0,1,0,0,1,0,0,1,0,0,1,1,1,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,1,1,0,0,1,0,0,1,1,1,1,1,1,0,0,0,0,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0],
        symmetric: true,
        question: "Mirror symmetry across```d line?"
      },
      {
        pattern: [0,1,1,0,1,1,1,0,1,1,0,0,0,0,1,0,1,0,1,0,0,0,0,1,1,1,1,0,1,1,1,1,0,0,0,0,1,0,1,0,1,0,0,0,1,1,1,1,0,1,0,1,1,1,1],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [0,1,0,1,0,0,0,1,0,1,0,1,0,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,0,1,0,0,0,0,0,1,0,1],
        symmetric: true,
        question: "Mirror symmetry across red line?"    },
      {
        pattern: [1,0,0,0,0,1,0,0,0,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,0,0,1,0,0,1,0,1,0,1,1,1,1,0,1,1,1,1,0,0,0,1,0,0,0,0,0,1,0,0],
        symmetric: true,
        question: "Mirror symmetry across```d line?"
      },
      {
        pattern: [1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,0,0,1,0,0,0,1,0,0,1,1,0,1,0,1,1,1,0,1,0,1],
        symmetric: true,
        question: "Mirror symmetry across```d line?"
      },
      {
        pattern: [0,1,0,1,1,1,1,1,0,1,0,0,0,1,0,1,0,1,0,1,0,0,1,1,0,1,0,0,0,1,0,1,1,1,1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [0,0,1,0,1,0,1,0,1,0,0,0,1,1,1,0,1,0,1,1,1,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1,0,0,1,0,0,1,1,0,1,1,1,1,1,0,1,1],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,1,0,0,1,1,1,0,0,1,1,1,0,1,1,1,0,1,1,1,0,1,0,0,1,0,0,1,0,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,0,1,1,1,0,0,0,1,1,1,0],
        symmetric: true,
        question: "Mirror symmetry across```d line?"
      },
      {
        pattern: [0,1,1,0,1,1,1,0,1,1,0,1,0,0,0,1,1,1,0,0,0,1,0,1,1,0,0,0,0,0,1,1,0,0,0,1,1,0,1,0,1,1,0,0,1,1,1,0,0,0,0,0,1,1,1],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,1,0,1,0,1,0,1,0,1,1,1,0,0,1,1,0,1,1,0,0,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,0,0,1,1,1,0,0,1,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"    },
      {
        pattern: [0,0,1,0,0,1,0,0,1,0,0,0,1,0,0,1,1,1,0,0,1,0,1,1,1,0,0,1,0,0,1,1,1,0,1,1,1,0,0,0,1,1,1,0,0,1,0,1,1,0,1,1,0,1,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,0,1,1,0,1,0,1,1,0,1,1,1,0,0,1,1,1,0,0,1,1,1,1,0,1,0,0,0,1,0,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,0,0,0,1,0,0,0,1,1],
        symmetric: true,
        question: "Mirror symmetry across```d line?"
      },
      {
        pattern: [1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,1,0,0,1,0,1,0,1,0,1,0,0,0,1,0,1,1,0,1,1,0,1,0,0,0,1,1,0,0,0,1,1,0,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,0,1,0,0,1,0,0,1,0,1,0,1,0,0,1,1,1,0,0,1,0,0,1,1,1,0,0,0,1,1,1,0,1,0,1,0,0,1,0,0,1,0,1,0,1,1,0,1,1,1,0,1,1,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,1,1,0,1,0,1,0,1,1,1,0,0,0,1,0,0,0,1,0,0,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,0,0,0,0,1,1,0],
        symmetric: true,
        question: "Mirror symmetry across```d line?"
      },
      {
        pattern: [0,1,0,1,1,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1,1,1,1,1,1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,0,0,0,0,1,0,0,0,1,0,0,0],
        symmetric: true,
        question: "Mirror symmetry across```d line?"
      },
      {
        pattern: [1,0,1,1,0,0,0,1,1,0,1,1,0,1,1,0,1,0,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,0,0,1,0,0,1,0,1,1,0,1,0,0,1,0,0,1,0,1],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [0,1,0,0,1,1,1,0,0,1,0,0,1,0,0,0,1,0,0,0,1,0,0,1,0,1,1,1,1,1,0,1,0,0,0,1,0,1,0,1,0,1,0,0,1,0,1,1,1,0,1,1,1,0,1],
        symmetric: true,
        question: "Mirror symmetry across```d line?"
      },
      {
        pattern: [0,0,0,1,0,0,0,1,0,0,0,0,1,0,1,1,1,1,1,0,1,0,0,1,1,0,1,0,1,0,1,1,0,0,0,0,1,1,0,1,1,0,0,0,0,1,0,1,0,1,0,1,0,1,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,0,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,0,0,0,1,1,1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,1,1,0,1,0,1,1,1,0,1,0,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"    },
      {
        pattern: [1,0,0,0,0,0,0,0,0,0,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,0,0,0,0,0,1,1,0,1,0,0,1,0,0,0,1,0,0,1,1,0,1,0,0,0,0,0,1,0,1],
        symmetric: true,
        question: "Mirror symmetry across```d line?"
      },
      {
        pattern: [1,0,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0,0,1,0,1,0,0,1,0,1,1,0,1,1,0,1,0,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,1,1,0,1,1,1],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,0,1,0,0,1,1,0,1,0,1,1,1,1,1,1,1,0,1,1,0,0,1,1,1,1,1,0,0,1,0,0,0,0,1,0,1,0,0,0,0],
        symmetric: true,
        question: "Mirror symmetry across```d line?"
      },
      {
        pattern: [1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,0,0,0,1,1,1,0,0,0,1,1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0],
        symmetric: true,
        question: "Mirror symmetry across```d line?"
      },
      {
        pattern: [0,1,0,0,0,1,0,0,0,1,0,0,0,0,1,0,1,0,1,0,0,0,0,0,1,1,1,0,1,1,1,0,0,1,0,1,1,1,0,1,1,1,0,1,0,0,1,0,0,1,0,0,1,0,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1,0,0,0,1,0,1,0,0,1,1,0,0,1,0,0,1,1,0,1,1,0,1,0,0,0,1,0,1,1],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,1,1,0,0,1,0,0,1,1,1,0,0,0,1,0,1,0,1,0,0,0,1,0,1,1,1,1,1,1,1,0,1,0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,1],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [0,1,1,1,1,1,1,1,1,1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,1,1,1,0,1,0,1,0,0,1,0,0,1,0,0,1,0,0,0,0,1,1,0,0,0,1,1,0,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,1,0,1,0,0,0,1,0,1,1,1,0,0,0,1,1,1,0,0,0,1,0,1,0,1,0,0,0,1,0,1,0,0,0,0,0,1,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [0,0,0,1,1,0,1,1,0,0,0,1,1,1,0,0,1,0,0,1,1,1,0,0,1,1,0,0,0,1,1,0,0,1,1,0,0,0,1,0,0,0,1,1,0,1,1,0,0,1,0,0,1,1,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1,1,1,1,1,0,0,0,1,0,1,1,1,1,1,1,1,0,1,0,0,1,1,0,1,0,1,1,0,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,0,1,1,1,1,1,1,1,0,1,0,0,1,1,1,0,1,1,1,0,0,1,1,1,0,1,1,1,0,1,1,1,1,1,1,0,1,1,1,0,1,1,1,0,0,0,0,0,1,0,0,0,0,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [0,1,0,1,1,0,1,1,0,1,0,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,0,1,0,1,1,0,0,0,1,1,0,0,1,0,0,1,1,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [0,0,0,0,0,1,0,0,0,0,0,1,1,0,0,0,1,0,0,0,1,1,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,1,0,1,0,1,1,1,0],
        symmetric: true,
        question: "Mirror symmetry across red line?"
      },
      {
        pattern: [1,1,0,1,1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,0,1,1,0,1,1,1,0,1,1,0,1,0,1,0,1,1,1,0,1,0,1,1,0,1,0,0,0,0,0,1,0,1],
        symmetric: true,
        question: "Mirror symmetry across"
      }



    ];

    function initGame() {
      updateTimer();
      updateProgress();
      gameTimer = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
      if (!gamePaused && gameActive) {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById("timer").textContent = 
          `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (timeLeft > 0) {
          timeLeft--;
        } else {
          endGame("Time's Up!");
        }
      }
    }

    function updateProgress() {
      const percentage = (currentProgress / maxProgress) * 100;
      document.getElementById("progressFill").style.width = percentage + "%";
      document.getElementById("progressText").textContent = currentProgress;
    }

    function updateLevel() {
      document.getElementById("levelNum").textContent = level;
    }

    // Enhanced createBalls function with better level scaling
    function createBalls() {
      const gameBoard = document.getElementById("gameBoard");
      const existingBalls = gameBoard.querySelectorAll('.ball');
      existingBalls.forEach(ball => ball.remove());

      // More challenging progression: more balls per level
      const ballCount = 15 + (level * 4); // Level 1: 19 balls, Level 2: 23 balls, etc.
      const positions = [];
      const boardRect = gameBoard.getBoundingClientRect();

      ballSequence = [];

      for (let i = 0; i < ballCount; i++) {
        let x, y;
        let attempts = 0;
        do {
          x = Math.random() * (boardRect.width - 80) + 10;
          y = Math.random() * (boardRect.height - 140) + 60;
          attempts++;
        } while (isOverlapping(x, y, positions, 60, 20) && attempts < 100);

        positions.push({x, y});

        const ball = document.createElement("div");
        ball.classList.add("ball");
        ball.dataset.index = i;
        ball.style.left = x + "px";
        ball.style.top = y + "px";

        ball.addEventListener('click', (e) => handleBallClick(i, e));
        gameBoard.appendChild(ball);

        ballSequence.push({
          index: i,
          x: x,
          y: y
        });
      }
    }

    function isOverlapping(x, y, positions, size = 60, padding = 20) {
      for (let pos of positions) {
        const dx = pos.x - x;
        const dy = pos.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < size + padding) return true;
      }
      return false;
    }

    function handleBallClick(ballIndex, event) {
      if (inSelectionPhase) {
        const ball = document.querySelector(`[data-index="${ballIndex}"]`);

        // Check if already selected
        if (ball.classList.contains('selected')) {
          // Remove selection
          ball.classList.remove('selected');
          ball.removeAttribute('data-sequence-number');
          selectedBallsInOrder = selectedBallsInOrder.filter(item => item.ballIndex !== ballIndex);
          updateSelectionDisplay();
          return;
        }

        // Add selection
        selectedBallsInOrder.push({
          ballIndex: ballIndex,
          selectionOrder: selectedBallsInOrder.length + 1
        });

        ball.classList.add('selected');
        ball.setAttribute('data-sequence-number', selectedBallsInOrder.length);
        updateSelectionDisplay();
      }
    }

    function updateSelectionDisplay() {
      document.getElementById('selectedCount').textContent = selectedBallsInOrder.length;
    }

    function startGame() {
      // Setup timing controls
      setupTimingSliders();

      document.getElementById("startScreen").style.display = "none";
      gameActive = true;
      document.getElementById("playBtn").textContent = "⏸";

      sequenceStep = 0;
      currentProgress = 1;
      shownSequence = [];
      symmetryResults = [];
      inSelectionPhase = false;

      updateLevel();
      initGame();
      createBalls();
      startSequence();
    }

    function startSequence() {
      if (sequenceStep >= totalSteps) {
        showSelectionPhase();
        return;
      }

      if (sequenceStep % 2 === 0) {
        showBall();
      } else {
        showSymmetry();
      }
    }

    function showBall() {
      const ballIndex = Math.floor(Math.random() * ballSequence.length);
      const ball = document.querySelector(`[data-index="${ballIndex}"]`);

      document.getElementById("gameInstruction").textContent = 
        `Remember this ball! (${ballDisplayTime/1000}s) - Sequence #${shownSequence.length + 1}`;

      if (ball) {
        ball.classList.add("active");

        shownSequence.push({
          ballIndex: ballIndex,
          sequenceOrder: shownSequence.length + 1,
          timing: ballDisplayTime,
          step: sequenceStep
        });

        setTimeout(() => {
          ball.classList.remove("active");
          sequenceStep++;
          currentProgress++;
          updateProgress();

          setTimeout(() => {
            startSequence();
          }, 300);
        }, ballDisplayTime);
      }
    }

    function showSymmetry() {
      const pattern = symmetryPatterns[Math.floor(Math.random() * symmetryPatterns.length)];
      const overlay = document.getElementById("symmetryOverlay");
      const grid = document.getElementById("symmetryGrid");
      const question = document.getElementById("symmetryQuestion");

      question.textContent = pattern.question;
      currentSymmetryPattern = pattern;

      grid.innerHTML = "";
      pattern.pattern.forEach(cell => {
        const div = document.createElement("div");
        div.className = cell === 1 ? "grid-cell" : "grid-cell dot";
        grid.appendChild(div);
      });

      overlay.style.display = "flex";
      startSymmetryTimer();
    }

    function startSymmetryTimer() {
      symmetryTimeLeft = Math.ceil(symmetryTime / 1000);
      document.getElementById("symmetryTimer").textContent = symmetryTimeLeft;

      symmetryTimer = setInterval(() => {
        symmetryTimeLeft--;
        document.getElementById("symmetryTimer").textContent = symmetryTimeLeft;

        if (symmetryTimeLeft <= 0) {
          clearInterval(symmetryTimer);
          answerSymmetry(false);
        }
      }, 1000);
    }

    function answerSymmetry(userAnswer) {
      clearInterval(symmetryTimer);
      const isCorrect = userAnswer === currentSymmetryPattern.symmetric;

      symmetryResults.push({
        pattern: currentSymmetryPattern,
        userAnswer: userAnswer,
        correct: isCorrect,
        step: sequenceStep
      });

      setTimeout(() => {
        document.getElementById("symmetryOverlay").style.display = "none";
        sequenceStep++;
        currentProgress++;
        updateProgress();

        setTimeout(() => {
          startSequence();
        }, 300);
      }, 800);
    }

    function showSelectionPhase() {
      inSelectionPhase = true;
      selectedBallsInOrder = [];

      // Show MINIMAL UI - NO BLOCKING OVERLAY
      document.getElementById("selectionProgress").style.display = "block";
      document.getElementById("resetButton").style.display = "block";
      document.getElementById("submitButton").style.display = "block";

      document.getElementById("gameInstruction").textContent = "Click the 3 balls in the same order!";
      document.getElementById("totalNeeded").textContent = shownSequence.length;
      updateSelectionDisplay();
    }

    function setupTimingSliders() {
      const ballSlider = document.getElementById("ballTimeSlider");
      const symmetrySlider = document.getElementById("symmetryTimeSlider");

      ballSlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        document.getElementById("ballTimeLabel").textContent = value + "s";
        ballDisplayTime = value * 1000;
      });

      symmetrySlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        document.getElementById("symmetryTimeLabel").textContent = value + "s";
        symmetryTime = value * 1000;
      });
    }

    function resetSelection() {
      selectedBallsInOrder = [];
      document.querySelectorAll('.ball.selected').forEach(ball => {
        ball.classList.remove('selected');
        ball.removeAttribute('data-sequence-number');
      });
      updateSelectionDisplay();
    }

    // MODIFIED submitFinalAnswer function with level progression logic
    function submitFinalAnswer() {
      const correctSequence = shownSequence.map(item => item.ballIndex);
      const userSequence = selectedBallsInOrder.map(item => item.ballIndex);

      let correctSelections = 0;
      const totalNeeded = correctSequence.length;

      // Check if selected balls match the correct sequence in order
      for (let i = 0; i < Math.min(userSequence.length, correctSequence.length); i++) {
        if (userSequence[i] === correctSequence[i]) {
          correctSelections++;
        }
      }

      const ballScore = Math.round((correctSelections / totalNeeded) * 100);
      const symmetryCorrect = symmetryResults.filter(r => r.correct).length;
      const symmetryScore = Math.round((symmetryCorrect / symmetryResults.length) * 100);
      const overallScore = Math.round((ballScore + symmetryScore) / 2);

      // Check if player qualifies for level advancement
      if (overallScore >= levelAdvancementThreshold) {
        if (level < maxLevel) {
          // Advance to next level
          level++;
          alert(`Excellent! Level ${level - 1} Complete!\n\nSequence Memory: ${ballScore}% (${correctSelections}/${totalNeeded})\nSymmetry: ${symmetryScore}% (${symmetryCorrect}/${symmetryResults.length})\n\nOverall: ${overallScore}%\n\n🎉 ADVANCING TO LEVEL ${level}! 🎉`);
          
          setTimeout(() => {
            startNextLevel();
          }, 2000);
        } else {
          // Player has completed all levels
          alert(`🏆 GAME COMPLETED! 🏆\n\nYou've mastered all ${maxLevel} levels!\n\nFinal Level Performance:\nSequence Memory: ${ballScore}% (${correctSelections}/${totalNeeded})\nSymmetry: ${symmetryScore}% (${symmetryCorrect}/${symmetryResults.length})\n\nOverall: ${overallScore}%\n\nCongratulations, Memory Master!`);
          
          setTimeout(() => {
            restartGame();
          }, 3000);
        }
      } else {
        // Player needs to retry current level
        alert(`Level ${level} - Try Again!\n\nSequence Memory: ${ballScore}% (${correctSelections}/${totalNeeded})\nSymmetry: ${symmetryScore}% (${symmetryCorrect}/${symmetryResults.length})\n\nOverall: ${overallScore}%\n\nNeed ${levelAdvancementThreshold}% or higher to advance!\n\n🔄 Retrying Level ${level}`);
        
        setTimeout(() => {
          retryCurrentLevel();
        }, 2000);
      }
    }

    // NEW function to start the next level
    function startNextLevel() {
      gameActive = false;
      gamePaused = false;
      clearInterval(gameTimer);
      inSelectionPhase = false;

      // Hide selection UI
      document.getElementById("selectionProgress").style.display = "none";
      document.getElementById("resetButton").style.display = "none";
      document.getElementById("submitButton").style.display = "none";
      
      // Hide overlays
      document.getElementById("symmetryOverlay").style.display = "none";

      // Reset sequence variables for new level
      sequenceStep = 0;
      currentProgress = 1;
      shownSequence = [];
      symmetryResults = [];
      timeLeft = 300; // Reset timer for new level

      // Update UI for new level
      updateLevel();
      updateProgress();
      updateTimer();

      // Show brief level intro
      document.getElementById("gameInstruction").textContent = `Level ${level} - Get Ready!`;
      
      // Start new level after brief pause
      setTimeout(() => {
        gameActive = true;
        document.getElementById("playBtn").textContent = "⏸";
        initGame();
        createBalls(); // This will create more balls based on new level
        startSequence();
      }, 1500);
    }

    // NEW function to retry current level
    function retryCurrentLevel() {
      gameActive = false;
      gamePaused = false;
      clearInterval(gameTimer);
      inSelectionPhase = false;

      // Hide selection UI
      document.getElementById("selectionProgress").style.display = "none";
      document.getElementById("resetButton").style.display = "none";
      document.getElementById("submitButton").style.display = "none";
      
      // Hide overlays
      document.getElementById("symmetryOverlay").style.display = "none";

      // Reset sequence variables for retry
      sequenceStep = 0;
      currentProgress = 1;
      shownSequence = [];
      symmetryResults = [];
      timeLeft = 300; // Reset timer for retry

      // Update UI
      updateProgress();
      updateTimer();

      // Show retry message
      document.getElementById("gameInstruction").textContent = `Level ${level} - Try Again!`;
      
      // Start level retry after brief pause
      setTimeout(() => {
        gameActive = true;
        document.getElementById("playBtn").textContent = "⏸";
        initGame();
        createBalls(); // Create balls for same level
        startSequence();
      }, 1500);
    }

    // MODIFIED restartGame to properly reset to level 1
    function restartGame() {
      gameActive = false;
      gamePaused = false;
      clearInterval(gameTimer);
      inSelectionPhase = false;

      // Hide selection UI
      document.getElementById("selectionProgress").style.display = "none";
      document.getElementById("resetButton").style.display = "none";
      document.getElementById("submitButton").style.display = "none";

      document.getElementById("startScreen").style.display = "flex";
      document.getElementById("symmetryOverlay").style.display = "none";

      // Reset to level 1
      level = 1;
      sequenceStep = 0;
      currentProgress = 1;
      timeLeft = 300;

      updateLevel();
      updateProgress();
      updateTimer();

      document.getElementById("playBtn").textContent = "▶";
      document.getElementById("gameInstruction").textContent = "Press Start to Begin!";
    }

    function togglePause() {
      if (!gameActive) return;

      if (gamePaused) {
        resumeGame();
      } else {
        pauseGame();
      }
    }

    function pauseGame() {
      gamePaused = true;
      document.getElementById("playBtn").textContent = "▶";
      document.getElementById("gameInstruction").textContent = "Game Paused";
    }

    function resumeGame() {
      gamePaused = false;
      document.getElementById("playBtn").textContent = "⏸";
    }

    function endGame(message) {
      gameActive = false;
      clearInterval(gameTimer);
      alert(message);
      setTimeout(restartGame, 1000);
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (document.getElementById("symmetryOverlay").style.display === "flex") {
        switch(e.key.toLowerCase()) {
          case 'y':
          case '1':
            answerSymmetry(true);
            break;
          case 'n':
          case '2':
            answerSymmetry(false);
            break;
        }
      }
    });

    // Initialize on page load
    window.addEventListener('load', () => {
      updateLevel();
      updateProgress();
      updateTimer();
    });
  
</html>
