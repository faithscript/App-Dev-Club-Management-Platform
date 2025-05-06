interface MockUser {
    _id: string;
    accountType: "Student" | "Mentor";
    fullName: string;
    email: string;
    password: string;
    mentor_name?: string; // only students have this
    fun_facts: string;
    points: number;
  }
  
  export const mockUsers: MockUser[] = [
    // Students
    {
      _id: "654a7b12f3e7d92a7b8e1f20",
      accountType: "Student",
      fullName: "John Doe",
      email: "john.doe@example.com",
      password: "hidden",
      mentor_name: "Lisa Johnson",
      fun_facts: "Loves hiking and playing guitar",
      points: 85,
    },
    {
      _id: "654a7b33f3e7d92a7b8e1f21",
      accountType: "Student",
      fullName: "Sarah Smith",
      email: "sarah.smith@example.com",
      password: "hidden",
      mentor_name: "Lisa Johnson",
      fun_facts: "Speaks three languages and loves baking",
      points: 85,
    },
    {
      _id: "654a7b54f3e7d92a7b8e1f22",
      accountType: "Student",
      fullName: "Mike Johnson",
      email: "mike.johnson@example.com",
      password: "hidden",
      mentor_name: "David Chen",
      fun_facts: "Former basketball player, loves sci-fi novels",
      points: 90,
    },

    // Mentors
    {
      _id: "654a7b75f3e7d92a7b8e1f23",
      accountType: "Mentor",
      fullName: "Lisa Johnson",
      email: "lisa.johnson@example.com",
      password: "hidden",
      fun_facts: "Loves chess and mountain biking",
      points: 95,
    },
    {
      _id: "654a7b96f3e7d92a7b8e1f24",
      accountType: "Mentor",
      fullName: "David Chen",
      email: "david.chen@example.com",
      password: "hidden",
      fun_facts: "Plays classical piano and runs marathons",
      points: 90,
    },

    {
      _id: "654a7b96f3e7d92a7b8e1f24",
      accountType: "Mentor",
      fullName: "A3",
      email: "david.chen@example.com",
      password: "hidden",
      fun_facts: "Plays classical piano and runs marathons",
      points: 80,
    },

    {
        _id: "654a7b96f3e7d92a7b8e1f24",
        accountType: "Mentor",
        fullName: "B4",
        email: "david.chen@example.com",
        password: "hidden",
        fun_facts: "Plays classical piano and runs marathons",
        points: 70,
    },

    {
        _id: "654a7b96f3e7d92a7b8e1f24",
        accountType: "Mentor",
        fullName: "C5",
        email: "david.chen@example.com",
        password: "hidden",
        fun_facts: "Plays classical piano and runs marathons",
        points: 70,
    },

    {
        _id: "654a7b96f3e7d92a7b8e1f24",
        accountType: "Mentor",
        fullName: "D6",
        email: "david.chen@example.com",
        password: "hidden",
        fun_facts: "Plays classical piano and runs marathons",
        points: 70,
    },

    {
        _id: "654a7b96f3e7d92a7b8e1f24",
        accountType: "Mentor",
        fullName: "E7",
        email: "david.chen@example.com",
        password: "hidden",
        fun_facts: "Plays classical piano and runs marathons",
        points: 50,
    },

    {
        _id: "654a7b96f3e7d92a7b8e1f24",
        accountType: "Mentor",
        fullName: "F8",
        email: "david.chen@example.com",
        password: "hidden",
        fun_facts: "Plays classical piano and runs marathons",
        points: 40,
    },

    {
        _id: "654a7b96f3e7d92a7b8e1f24",
        accountType: "Mentor",
        fullName: "G9",
        email: "david.chen@example.com",
        password: "hidden",
        fun_facts: "Plays classical piano and runs marathons",
        points: 35,
    },

    {
        _id: "654a7b96f3e7d92a7b8e1f24",
        accountType: "Mentor",
        fullName: "H10",
        email: "david.chen@example.com",
        password: "hidden",
        fun_facts: "Plays classical piano and runs marathons",
        points: 30,
    },

    {
        _id: "654a7b96f3e7d92a7b8e1f24",
        accountType: "Mentor",
        fullName: "I11",
        email: "david.chen@example.com",
        password: "hidden",
        fun_facts: "Plays classical piano and runs marathons",
        points: 25,
    },

    {
        _id: "654a7b96f3e7d92a7b8e1f24",
        accountType: "Mentor",
        fullName: "J12",
        email: "david.chen@example.com",
        password: "hidden",
        fun_facts: "Plays classical piano and runs marathons",
        points: 20,
    },

    {
        _id: "654a7b96f3e7d92a7b8e1f24",
        accountType: "Mentor",
        fullName: "K13",
        email: "david.chen@example.com",
        password: "hidden",
        fun_facts: "Plays classical piano and runs marathons",
        points: 15,
    },

    {
        _id: "654a7b96f3e7d92a7b8e1f24",
        accountType: "Mentor",
        fullName: "L14",
        email: "david.chen@example.com",
        password: "hidden",
        fun_facts: "Plays classical piano and runs marathons",
        points: 10,
    },

    {
        _id: "654a7b96f3e7d92a7b8e1f24",
        accountType: "Mentor",
        fullName: "M15",
        email: "david.chen@example.com",
        password: "hidden",
        fun_facts: "Plays classical piano and runs marathons",
        points: 5,
    }
  ];