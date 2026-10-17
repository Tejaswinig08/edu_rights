import dotenv from "dotenv";
import mongoose from "mongoose";
import Module from "./models/Module.js";
import Quiz from "./models/Quiz.js";
import KnowledgeArticle from "./models/KnowledgeArticle.js";

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// ============================================================
// MODULE CONTENT
// ============================================================

const mod1Content = `🛡️ RIGHT TO PROTECTION – सुरक्षा का अधिकार

What is this right?
Every child has the right to be safe from violence, abuse, exploitation, trafficking, harmful work and other forms of mistreatment. Children should be able to grow up in a safe environment where they can learn, play and develop without fear.

🌟 Story: Aarav Speaks Up
Aarav was walking home from school when he noticed a young boy working at a roadside shop every day. The boy looked tired and was missing school.
Aarav felt that something was not right. Instead of making fun of the boy or ignoring the situation, Aarav told his teacher about what he had seen.
The teacher explained that children have the right to protection and education. Adults and authorities have a responsibility to protect children from abuse and exploitation.

🛡️ What is the solution?
If a child feels unsafe or sees another child being harmed:
- Move to a safe place if possible.
- Tell a trusted adult such as a parent, teacher or guardian.
- Do not blame the child who is being harmed.
- Do not try to handle a dangerous situation alone.
- Ask a responsible adult or appropriate authority for help.

📚 Lesson Learnt
Every child deserves to feel safe. Speaking to a trusted adult when something feels wrong is a brave and responsible step.

⚖️ Important Laws
- Protection of Children from Sexual Offences Act, 2012 (POCSO Act) – protects children from sexual assault, sexual harassment and pornography.
- Juvenile Justice (Care and Protection of Children) Act, 2015 – provides a framework for the care, protection, development and rehabilitation of children.
- Child and Adolescent Labour (Prohibition and Regulation) Act, 1986 – prohibits employment of children and adolescents from hazardous occupations.
- Prohibition of Child Marriage Act, 2006 – provides for prohibition of child marriages.

🪪 RIGHT TO IDENTITY – पहचान का अधिकार

What is this right?
Every child should have an identity. Important identity information can include the child's name and official record of birth. Birth registration creates an official record of a child's birth.

🌟 Story: Welcome, Aarohi!
When Aarohi was born, her parents made sure that her birth was officially registered. As she grew older, her birth record helped provide an official record of important information about when and where she was born.

🪪 What is the solution?
Families should:
- Register a child's birth.
- Keep important documents safe.
- Correct mistakes in official records through the proper process.
- Avoid sharing personal documents unnecessarily.

📚 Lesson Learnt
Having an official identity record helps children access services and prove important details about themselves.

⚖️ Important Law
- The Registration of Births and Deaths Act, 1969 provides the legal framework for registration of births and deaths.`;

const mod2Content = `❤️ RIGHT TO SURVIVAL – जीवन का अधिकार

What is this right?
Every child needs the basic things required to survive and grow, such as nutritious food, clean water, healthcare, shelter, care and protection. Survival is not only about staying alive. Children also need the conditions that allow them to grow in a healthy and safe environment.

🌟 Story: Meera Gets Help
Meera suddenly became very sick and had a high fever. Instead of ignoring the problem, her parents took her to a healthcare centre. The doctor checked Meera and gave her the treatment she needed. Her parents also made sure that she had nutritious food, clean water and enough rest.

🏥 What is the solution?
Children should have access to:
- Healthcare and medical attention when needed.
- Nutritious food.
- Safe drinking water.
- A safe living environment.
- Care and protection from adults.

📚 Lesson Learnt
Every child needs care, health, food, water and safety to survive and grow.

⚖️ Legal and Government Support
- Article 21 of the Constitution of India protects life and personal liberty.
- National Food Security Act, 2013 provides a legal framework related to food and nutritional security.
- Government health programmes such as the National Health Mission (NHM) support healthcare services.

🏥 RIGHT TO HEALTH – स्वास्थ्य का अधिकार

What is this right?
Children need healthcare to stay healthy, prevent illness and receive treatment when they become sick. Healthcare can include medical treatment, vaccination, regular health check-ups, mental health support, medicines and healthy habits.

🌟 Story: Anaya Takes Care of Her Health
Anaya often felt tired and did not understand why. Her parents took her to a healthcare professional. The doctor checked her and advised her to eat nutritious food, drink enough water, sleep properly and stay physically active. Anaya learned that taking care of health is an important part of growing up.

🏥 What is the solution?
Children should:
- Tell a trusted adult when they are unwell.
- Visit a healthcare professional when necessary.
- Eat nutritious food and drink safe water.
- Get enough sleep and stay physically active.
- Take care of their mental well-being.

📚 Lesson Learnt
Good health helps children learn, play and grow. Asking for healthcare when needed is important.

⚖️ Government Support
- National Health Mission (NHM) supports health services in India.
- Ayushman Bharat is a major government health initiative.
- Vaccination programmes support prevention of diseases.

🍎 RIGHT TO FOOD AND NUTRITION – भोजन और पोषण का अधिकार

What is this right?
Children need enough nutritious food to grow, stay healthy and have energy for learning and playing. A healthy diet can include different kinds of foods such as fruits, vegetables, grains, pulses, milk or other suitable sources of nutrients.

🌟 Story: The Healthy Lunch Box
Riya used to bring only packaged snacks to school. Her teacher explained that children need different nutrients for growth and energy. Riya and her family started including a variety of nutritious foods in her meals. Soon, Riya understood that food is not just about filling your stomach—it is about giving your body the nutrients it needs.

🍎 What is the solution?
Children should:
- Eat a variety of nutritious foods.
- Drink safe water.
- Avoid depending only on highly processed snacks.
- Eat regular meals.
- Tell an adult if they regularly do not have enough food.

📚 Lesson Learnt
Good nutrition gives children energy to learn, play and grow.

⚖️ Legal and Government Support
- National Food Security Act, 2013 provides a legal framework for food and nutritional security.
- PM POSHAN supports nutritional meals for eligible schoolchildren through the school meal programme.

💧 RIGHT TO CLEAN WATER AND SANITATION – स्वच्छ पानी और स्वच्छता का अधिकार

What is this right?
Children need safe drinking water, clean toilets and hygienic surroundings to stay healthy. Good sanitation and hygiene can help prevent the spread of many diseases.

🌟 Story: The School Water Problem
Students at a school noticed that the drinking-water area was dirty. Instead of ignoring the problem, they told their teacher. The teacher informed the school administration. The area was cleaned and students were reminded to wash their hands regularly.

💧 What is the solution?
Children can:
- Drink safe water.
- Wash their hands regularly.
- Use clean toilets.
- Keep surroundings clean.
- Tell an adult when water or sanitation facilities are unsafe.

📚 Lesson Learnt
Clean water, sanitation and good hygiene help protect our health.

⚖️ Government Support
- Jal Jeevan Mission focuses on improving access to safe and adequate drinking water.
- Swachh Bharat Mission focuses on sanitation and cleanliness.`;

const mod3Content = `🌱 RIGHT TO DEVELOPMENT – विकास का अधिकार

What is this right?
Growing up is not only about becoming taller. Children need opportunities to develop their knowledge, physical abilities, creativity, emotional skills, social skills, problem-solving abilities and confidence. Education, play, family support and opportunities to learn all contribute to a child's development.

🌟 Story: Rohan Builds His Future
Rohan loved drawing but thought that only studying textbooks was important. His teacher encouraged him to participate in drawing competitions, sports and science activities. Rohan slowly became more confident. He learned how to work with others, solve problems and express his ideas. He understood that development means growing in many different ways—not only getting good marks.

🌱 What is the solution?
Children should get opportunities to:
- Learn new things.
- Play and exercise.
- Develop creative skills.
- Make friends and communicate.
- Express emotions.
- Solve problems.
- Discover their interests.

📚 Lesson Learnt
Every child should get opportunities to learn, play, create, communicate and develop their full potential.

⚖️ Legal and Policy Support
- Right of Children to Free and Compulsory Education Act, 2009 supports education for children aged 6–14.
- Integrated Child Development Services (ICDS) supports early childhood care and development.
- National Education Policy (NEP) 2020 promotes holistic development and learning.

📚 RIGHT TO EDUCATION – शिक्षा का अधिकार

What is this right?
Education gives children the opportunity to learn, develop skills, understand the world and prepare for their future.

🌟 Story: Kabir Goes Back to School
Kabir wanted to attend school but his family was worried about the cost of elementary education. Kabir's teacher explained that under India's Right to Education framework, children aged 6–14 have a right to free and compulsory education. Kabir's family approached the school and the appropriate authorities to understand the available provisions. Kabir was happy to return to learning.

📚 What is the solution?
Children should:
- Attend school regularly.
- Have a safe learning environment.
- Get opportunities to learn.
- Ask teachers questions.
- Seek help when they face difficulties.
- Be treated fairly at school.

📚 Lesson Learnt
Education helps children learn, grow, build skills and create opportunities for their future.

⚖️ Important Law
- The Right of Children to Free and Compulsory Education Act, 2009 (RTE Act) provides for free and compulsory education for children aged 6–14 years.
- The RTE framework also contains provisions relating to schools, teachers, admission and children's rights in education.`;

const mod4Content = `🗣️ RIGHT TO PARTICIPATION – भागीदारी का अधिकार

What is this right?
Children have the right to express their views on matters that affect them, according to their age and maturity. Their opinions should be listened to and taken seriously.

🌟 Story: The New School Club
A school wanted to start a new after-school activity. Instead of deciding everything without the students, the teacher asked them what they would like. Some students wanted sports. Others wanted art, music or a science club. The teacher listened to everyone's suggestions. The school then decided to create activities based on the students' ideas.

🗣️ What is the solution?
Children can participate by:
- Sharing their opinions respectfully.
- Listening to other people's opinions.
- Taking part in school activities.
- Asking questions.
- Suggesting ideas.
- Respecting different viewpoints.
Participation does not mean that children always get exactly what they ask for. It means their views should have an opportunity to be heard and considered.

📚 Lesson Learnt
Your voice matters. Listen respectfully, express yourself clearly and give others a chance to speak too.

⚖️ Legal and International Support
- UN Convention on the Rights of the Child (UNCRC), Article 12 recognises children's right to express views in matters affecting them.
- Article 19(1)(a) of the Constitution of India protects freedom of speech and expression.

🎤 RIGHT TO FREEDOM OF EXPRESSION – अभिव्यक्ति की स्वतंत्रता का अधिकार

What is this right?
Children should have opportunities to express their thoughts, ideas and feelings. Freedom of expression also comes with responsibility. We should express ourselves respectfully and should not use our words to threaten, bully or deliberately harm others.

🌟 Story: The Class Project
A teacher asked students to choose a topic for a class project. Arjun wanted to study space, while his friend wanted to study animals. Instead of arguing, both students explained why they liked their choices. They listened to each other and reached a decision together.

🗣️ What is the solution?
Children can:
- Express their opinions respectfully.
- Ask questions.
- Share ideas.
- Listen to other viewpoints.
- Talk to a trusted adult about their feelings.
- Avoid bullying, threats and harmful speech.

📚 Lesson Learnt
Your thoughts and feelings matter. Express them respectfully and allow others to express themselves too.

⚖️ Legal and International Support
- Article 19(1)(a) of the Constitution of India protects freedom of speech and expression, subject to constitutional restrictions.
- UNCRC Article 13 recognises children's freedom of expression.
- UNCRC Article 12 is particularly relevant when children's views on matters affecting them are considered.`;

const mod5Content = `🏠 RIGHT TO FAMILY CARE – परिवार की देखभाल का अधिकार

What is this right?
Children need a safe, caring and supportive family environment whenever possible. When a child cannot safely live with their parents or usual caregivers, child-protection systems can provide appropriate care and support.

🌟 Story: Sara Needs a Safe Home
Sara was unable to safely stay with her family for some time. A responsible adult contacted the appropriate child-protection authorities. Sara was connected with a care system designed to protect her and support her well-being. The goal was not simply to give Sara a place to stay, but to make sure she was safe, cared for and supported.

🏠 What is the solution?
Children who need help should:
- Tell a trusted adult.
- Seek help from responsible authorities when necessary.
- Be provided with safe and appropriate care.
- Receive support for education, health and development.

📚 Lesson Learnt
Every child deserves care, safety and support. A child who needs help should never be ignored.

⚖️ Important Law
- The Juvenile Justice (Care and Protection of Children) Act, 2015 provides a framework for children in need of care and protection, including rehabilitation, social reintegration and adoption-related provisions.

⚖️ RIGHT TO EQUALITY – समानता का अधिकार

What is this right?
Every child deserves fair and equal treatment. A child should not be treated unfairly because of their gender, disability, religion, language, social background or other personal circumstances.

🌟 Story: Everyone Gets a Chance
A school was selecting students for a science competition. Two students had different backgrounds and one student had a disability. The teacher made sure that the selection process was fair and that the student with a disability received the support needed to participate. Everyone got an equal opportunity to show their abilities.

⚖️ What is the solution?
We can promote equality by:
- Treating people respectfully.
- Including everyone in activities.
- Avoiding discrimination.
- Giving people a fair opportunity.
- Speaking up when someone is being unfairly excluded.

📚 Lesson Learnt
Being different does not make someone less important. Everyone deserves dignity, respect and fair opportunities.

⚖️ Constitutional Support
- Article 14 provides equality before the law and equal protection of the laws.
- Article 15 prohibits discrimination on specified grounds.

♿ RIGHTS OF CHILDREN WITH DISABILITIES – दिव्यांग बच्चों के अधिकार

What is this right?
Children with disabilities have the right to dignity, inclusion, education, healthcare, recreation and opportunities to participate in society. A disability should not be a reason to exclude a child from learning, playing or participating.

🌟 Story: Neha Joins the School Team
Neha uses a wheelchair and wanted to participate in a school activity. At first, the activity area was difficult for her to access. The school made changes so that Neha could participate more easily. Her classmates also learned that inclusion means making sure everyone gets a fair opportunity to participate. Neha joined the activity and enjoyed it with her friends.

♿ What is the solution?
Schools and communities can support inclusion by providing:
- Accessible buildings and facilities.
- Inclusive education.
- Reasonable support and accommodations.
- Accessible learning materials.
- Equal opportunities in sports and activities.
- Respectful treatment.

📚 Lesson Learnt
A disability does not reduce a person's value. Everyone deserves dignity, inclusion and a fair opportunity to learn and participate.

⚖️ Important Law
- The Rights of Persons with Disabilities Act, 2016 (RPwD Act) provides a legal framework concerning the rights and entitlements of persons with disabilities.`;

const mod6Content = `⚽ RIGHT TO PLAY AND RECREATION – खेलने और मनोरंजन का अधिकार

What is this right?
Children have the right to play, rest and take part in recreational activities. Play can help children stay physically active, develop creativity, learn teamwork and enjoy time with others.

🌟 Story: Riya's Free Time
Riya spent almost all her time studying because she thought playing was a waste of time. Her teacher explained that play is also important for a child's development. Riya started playing badminton with her friends after school. She became more active, learned teamwork and felt happier.

⚽ What is the solution?
Children should have opportunities to:
- Play sports.
- Draw and create.
- Read for enjoyment.
- Spend time with friends.
- Participate in recreational activities.
- Rest and relax.

📚 Lesson Learnt
Play is not a waste of time. Healthy play helps children grow, learn and enjoy life.

⚖️ International and Policy Support
- UN Convention on the Rights of the Child, Article 31 recognises children's right to rest, leisure, play and recreational activities.
- National Education Policy 2020 promotes holistic development and gives importance to sports and other activities.

🔐 RIGHT TO PRIVACY – निजता का अधिकार

What is this right?
Children's personal information and private life should be respected and protected. Personal information can include passwords, phone numbers, home address, personal photographs, school details, location information and other identifying information.

🌟 Story: Don't Share the Password!
Aanya received a message from someone online. The person said: "Send me your password and your home address. I want to send you a surprise." Aanya remembered what she had learned about online privacy. She did not share her information. Instead, she told her parent about the message and blocked the person.

🔐 What is the solution?
Children should:
- Keep passwords private.
- Avoid sharing their home address online.
- Be careful when sharing photographs.
- Avoid sharing live location unnecessarily.
- Tell a trusted adult about suspicious requests.
- Use strong passwords and appropriate privacy settings.

📚 Lesson Learnt
Think before you share. Personal information should not be given to strangers or posted publicly without a good reason.

⚖️ Legal Support
- The Digital Personal Data Protection Act, 2023 establishes a legal framework for processing digital personal data and includes specific provisions relating to children's personal data.`;

// ============================================================
// SEED FUNCTION
// ============================================================

const seedData = async () => {
  try {
    await connectDB();

    console.log("Clearing collections...");
    await Module.deleteMany();
    await Quiz.deleteMany();
    await KnowledgeArticle.deleteMany();

    // ==========================================
    // MODULES
    // ==========================================
    console.log("Inserting modules...");
    const modules = [
      {
        title: "My Safety & Identity",
        slug: "my-safety-and-identity",
        description: "Learn about your Right to Protection and Right to Identity – stay safe and know who you are!",
        icon: "🛡️",
        content: mod1Content,
        order: 1,
        pointsReward: 50,
        requiredLevel: 1,
        videoUrls: [{ title: "Right to Protection & Identity", url: "https://youtu.be/QGLnnk46UQ0" }],
      },
      {
        title: "My Life & Well-being",
        slug: "my-life-and-wellbeing",
        description: "Your rights to survive, stay healthy, eat nutritious food, and have clean water.",
        icon: "❤️",
        content: mod2Content,
        order: 2,
        pointsReward: 75,
        requiredLevel: 1,
        videoUrls: [{ title: "Right to Survival, Health, Food & Water", url: "https://youtu.be/0qZIRV5O1po" }],
      },
      {
        title: "My Learning & Growth",
        slug: "my-learning-and-growth",
        description: "Education and development – your keys to building a bright future!",
        icon: "📚",
        content: mod3Content,
        order: 3,
        pointsReward: 50,
        requiredLevel: 1,
        videoUrls: [{ title: "Right to Development & Education", url: "https://youtu.be/N14_XNH8Mqs" }],
      },
      {
        title: "My Voice & Freedom",
        slug: "my-voice-and-freedom",
        description: "Your voice matters! Learn how to participate and express yourself.",
        icon: "🗣️",
        content: mod4Content,
        order: 4,
        pointsReward: 75,
        requiredLevel: 2,
        videoUrls: [{ title: "Right to Participation & Expression", url: "https://youtu.be/wqc89bRcGa8" }],
      },
      {
        title: "My Family, Equality & Inclusion",
        slug: "my-family-equality-and-inclusion",
        description: "Family care, equal treatment, and inclusion for every child.",
        icon: "⚖️",
        content: mod5Content,
        order: 5,
        pointsReward: 100,
        requiredLevel: 2,
        videoUrls: [
          { title: "Right to Family Care & Equality", url: "https://youtu.be/pn-JLX6-6Hw" },
          { title: "Rights of Children with Disabilities", url: "https://youtu.be/3SzazN2OrsQ" },
          { title: "Right to Equality", url: "https://youtu.be/bcumR1bDgMw" },
        ],
      },
      {
        title: "My Play & Privacy",
        slug: "my-play-and-privacy",
        description: "Playing is your right! And so is keeping your personal info safe.",
        icon: "⚽",
        content: mod6Content,
        order: 6,
        pointsReward: 100,
        requiredLevel: 3,
        videoUrls: [{ title: "Right to Play & Privacy", url: "https://youtu.be/mTBxAYYxTtc" }],
      },
    ];

    const insertedModules = await Module.insertMany(modules);
    const bySlug = (s) => insertedModules.find((m) => m.slug === s);

    // ==========================================
    // QUIZZES — 10 questions per module
    // ==========================================
    console.log("Inserting quizzes...");
    const quizzes = [
      // MODULE 1: My Safety & Identity
      {
        moduleId: bySlug("my-safety-and-identity")._id,
        questions: [
          { question: "What should a child do if they feel unsafe?", options: ["Keep it secret", "Tell a trusted adult", "Blame themselves", "Ignore it"], correctIndex: 1, explanation: "A child should always tell a trusted adult such as a parent, teacher or guardian." },
          { question: "Which law protects children from sexual offences?", options: ["RTE Act", "POCSO Act", "Food Safety Act", "Motor Vehicles Act"], correctIndex: 1, explanation: "The POCSO Act, 2012 protects children from sexual assault, harassment and pornography." },
          { question: "Why is child labour harmful?", options: ["It can affect a child's safety, education and development", "It always improves education", "It guarantees a better future", "It has no effect on children"], correctIndex: 0, explanation: "Child labour takes away a child's right to education, safety and healthy development." },
          { question: "If you see another child being harmed, what is a responsible action?", options: ["Laugh", "Record it for fun", "Tell a trusted adult", "Join in"], correctIndex: 2, explanation: "Telling a trusted adult is the responsible and brave thing to do." },
          { question: "A child is responsible for abuse or violence done to them.", options: ["True", "False", "Maybe", "Not sure"], correctIndex: 1, explanation: "It is NEVER a child's fault. The person causing harm is responsible." },
          { question: "What is one important part of a child's identity?", options: ["Official record of birth", "Favourite cartoon", "Favourite colour", "Favourite game"], correctIndex: 0, explanation: "A birth record is an important part of a child's official identity." },
          { question: "Why is birth registration important?", options: ["It creates an official record of a child's birth", "It is only for adults", "It is used only for sports", "It has no purpose"], correctIndex: 0, explanation: "Birth registration provides legal recognition and helps access services like education and healthcare." },
          { question: "Which law deals with registration of births and deaths?", options: ["Registration of Births and Deaths Act, 1969", "POCSO Act", "RTE Act", "RPwD Act"], correctIndex: 0, explanation: "The Registration of Births and Deaths Act, 1969 provides the legal framework for registering births." },
          { question: "Can someone take your name away from you?", options: ["Yes, easily", "No, it belongs to you", "Only if they ask nicely", "Only on your birthday"], correctIndex: 1, explanation: "Your name is a special part of your identity and cannot be taken from you." },
          { question: "Every child has the right to be ______ from violence, abuse and exploitation.", options: ["punished", "protected", "ignored", "separated"], correctIndex: 1, explanation: "Every child has the right to be PROTECTED from all forms of harm." },
        ],
      },
      // MODULE 2: My Life & Well-being
      {
        moduleId: bySlug("my-life-and-wellbeing")._id,
        questions: [
          { question: "Which of these is important for a child's survival?", options: ["Clean water", "Expensive toys", "Video games", "Designer clothes"], correctIndex: 0, explanation: "Clean water is a basic survival need for every child." },
          { question: "What should a child do when they are seriously ill?", options: ["Ignore it", "Seek appropriate healthcare with help from a trusted adult", "Hide the illness", "Stop eating"], correctIndex: 1, explanation: "Children should seek healthcare with help from a trusted adult when they are ill." },
          { question: "Which constitutional provision protects life and personal liberty?", options: ["Article 21", "Article 51A", "Article 370", "Article 300"], correctIndex: 0, explanation: "Article 21 of the Indian Constitution protects the right to life and personal liberty." },
          { question: "Which government mission supports health services in India?", options: ["National Health Mission", "Right to Education Mission", "Clean School Mission", "Sports Mission"], correctIndex: 0, explanation: "The National Health Mission (NHM) supports health services across India." },
          { question: "Vaccination can help:", options: ["Prevent certain diseases", "Cause every disease", "Replace all food", "Replace sleep"], correctIndex: 0, explanation: "Vaccines help build protection against certain infectious diseases." },
          { question: "Why is nutritious food important?", options: ["It supports healthy growth and development", "It is only for adults", "It is unnecessary", "It prevents learning"], correctIndex: 0, explanation: "Nutritious food gives children the energy and nutrients they need to grow." },
          { question: "Which law addresses food and nutritional security?", options: ["National Food Security Act, 2013", "POCSO Act", "RTE Act", "JJ Act"], correctIndex: 0, explanation: "The National Food Security Act, 2013 provides a legal framework for food and nutritional security." },
          { question: "Which is generally a healthier choice?", options: ["A variety of nutritious foods", "Only sugary snacks every day", "No meals", "Only soft drinks"], correctIndex: 0, explanation: "A variety of nutritious foods provides different nutrients children need." },
          { question: "Why is clean drinking water important?", options: ["It supports health and helps prevent illness", "It is only useful for plants", "It has no purpose", "It replaces food"], correctIndex: 0, explanation: "Clean water is essential for health and helps prevent water-related illness." },
          { question: "Which programme focuses on rural drinking-water supply?", options: ["Jal Jeevan Mission", "RTE", "POCSO", "PM POSHAN"], correctIndex: 0, explanation: "The Jal Jeevan Mission focuses on improving access to safe and adequate drinking water." },
        ],
      },
      // MODULE 3: My Learning & Growth
      {
        moduleId: bySlug("my-learning-and-growth")._id,
        questions: [
          { question: "Development means:", options: ["Only growing taller", "Only getting marks", "Growing physically, mentally, emotionally and socially", "Only playing games"], correctIndex: 2, explanation: "Development includes physical, mental, emotional and social growth." },
          { question: "Which activity can support development?", options: ["Learning a skill", "Never talking to anyone", "Avoiding all activities", "Never playing"], correctIndex: 0, explanation: "Learning new skills is an important part of a child's development." },
          { question: "Why is play important for development?", options: ["It can support physical, social and creative development", "It stops development", "It has no purpose", "It replaces all education"], correctIndex: 0, explanation: "Play helps children explore, learn teamwork and develop creativity." },
          { question: "Creativity can be part of a child's development.", options: ["True", "False", "Maybe", "Not sure"], correctIndex: 0, explanation: "Creativity is an important part of how children grow and express themselves." },
          { question: "Which law provides free and compulsory education for children aged 6–14?", options: ["POCSO Act", "RTE Act, 2009", "Companies Act", "Motor Vehicles Act"], correctIndex: 1, explanation: "The RTE Act, 2009 provides for free and compulsory education for children aged 6–14." },
          { question: "What does RTE stand for?", options: ["Right to Education", "Right to Employment", "Road Transport Education", "Rural Training Education"], correctIndex: 0, explanation: "RTE stands for the Right of Children to Free and Compulsory Education Act." },
          { question: "The RTE Act mainly covers which age group?", options: ["2–5", "6–14", "15–21", "21–30"], correctIndex: 1, explanation: "The RTE Act covers children between 6 and 14 years of age." },
          { question: "Why is education important?", options: ["It helps children learn and develop skills", "It prevents children from developing", "It is only useful for sports", "It has no effect on the future"], correctIndex: 0, explanation: "Education helps children learn, grow, build skills and create future opportunities." },
          { question: "Children should be encouraged to ask questions while learning.", options: ["True", "False", "Maybe", "Not sure"], correctIndex: 0, explanation: "Asking questions is an important part of active learning and understanding." },
          { question: "What should a child do when they face difficulty in learning?", options: ["Ask a teacher or trusted adult for help", "Stop learning", "Hide the problem", "Never ask questions"], correctIndex: 0, explanation: "Seeking help is a responsible step when facing learning difficulties." },
        ],
      },
      // MODULE 4: My Voice & Freedom
      {
        moduleId: bySlug("my-voice-and-freedom")._id,
        questions: [
          { question: "What does participation mean?", options: ["Never speaking", "Having an opportunity to express your views and be heard", "Making everyone agree with you", "Ignoring others"], correctIndex: 1, explanation: "Participation means having a chance to share your views and have them considered." },
          { question: "What should you do when someone has a different opinion?", options: ["Insult them", "Listen respectfully", "Stop them from speaking", "Shout"], correctIndex: 1, explanation: "Listening respectfully is part of healthy communication and participation." },
          { question: "Children should never be allowed to express their opinions.", options: ["True", "False", "Maybe", "Not sure"], correctIndex: 1, explanation: "Children have the right to express their views on matters that affect them." },
          { question: "Which UNCRC provision is especially relevant to children's right to be heard?", options: ["Article 12", "Article 1", "Article 50", "Article 100"], correctIndex: 0, explanation: "UNCRC Article 12 recognises children's right to express views in matters affecting them." },
          { question: "Which is a good example of participation?", options: ["Suggesting an idea for a school activity", "Bullying someone", "Stopping others from speaking", "Ignoring everyone's opinion"], correctIndex: 0, explanation: "Suggesting ideas respectfully is a positive form of participation." },
          { question: "What does freedom of expression allow?", options: ["Sharing thoughts and ideas responsibly", "Hurting anyone you want", "Threatening others", "Bullying people"], correctIndex: 0, explanation: "Freedom of expression means sharing ideas responsibly while respecting others." },
          { question: "What should you do when someone disagrees with you?", options: ["Listen respectfully", "Insult them", "Shout at them", "Stop them from speaking"], correctIndex: 0, explanation: "Respectful listening is key to healthy discussion and expression." },
          { question: "Which constitutional provision protects freedom of speech and expression?", options: ["Article 19(1)(a)", "Article 14", "Article 21A", "Article 44"], correctIndex: 0, explanation: "Article 19(1)(a) of the Indian Constitution protects freedom of speech and expression." },
          { question: "Freedom of expression means you can threaten anyone without consequences.", options: ["True", "False", "Maybe", "Not sure"], correctIndex: 1, explanation: "Freedom of expression comes with responsibility. Threatening others is not acceptable." },
          { question: "Which UNCRC article deals specifically with freedom of expression?", options: ["Article 13", "Article 31", "Article 2", "Article 28"], correctIndex: 0, explanation: "UNCRC Article 13 recognises children's freedom of expression." },
        ],
      },
      // MODULE 5: My Family, Equality & Inclusion
      {
        moduleId: bySlug("my-family-equality-and-inclusion")._id,
        questions: [
          { question: "What does family care provide to children?", options: ["Safety, care and support", "Fear", "Isolation", "No education"], correctIndex: 0, explanation: "Family care provides children with safety, love, care and support." },
          { question: "What should a child do if they do not feel safe at home?", options: ["Keep it secret forever", "Tell a trusted adult and seek help", "Blame themselves", "Ignore the situation"], correctIndex: 1, explanation: "A child who feels unsafe should always tell a trusted adult and seek help." },
          { question: "Which law deals with care and protection of children?", options: ["Juvenile Justice Act, 2015", "RTE Act", "National Food Security Act", "Motor Vehicles Act"], correctIndex: 0, explanation: "The JJ Act, 2015 provides a framework for care and protection of children in need." },
          { question: "What does equality mean?", options: ["Everyone should be treated fairly and with dignity", "Only some children deserve opportunities", "Differences should be punished", "Some children are more important than others"], correctIndex: 0, explanation: "Equality means every child deserves fair treatment, dignity and equal opportunities." },
          { question: "Which constitutional article is associated with equality before the law?", options: ["Article 14", "Article 21A", "Article 32", "Article 51A"], correctIndex: 0, explanation: "Article 14 of the Indian Constitution provides equality before the law." },
          { question: "Which is an example of discrimination?", options: ["Excluding someone unfairly because of their background", "Helping a classmate", "Sharing materials", "Listening to everyone"], correctIndex: 0, explanation: "Excluding someone unfairly based on personal circumstances is discrimination." },
          { question: "A child's disability should be a reason to deny them every opportunity.", options: ["True", "False", "Maybe", "Not sure"], correctIndex: 1, explanation: "Disability is never a valid reason to deny a child their rights and opportunities." },
          { question: "Should a child with a disability be excluded from school activities simply because of their disability?", options: ["Yes", "No", "Only sometimes without reason", "Always"], correctIndex: 1, explanation: "Children with disabilities deserve equal access to education and activities." },
          { question: "What does inclusion mean?", options: ["Making sure everyone has an opportunity to participate", "Excluding people who are different", "Allowing only some students to participate", "Ignoring accessibility"], correctIndex: 0, explanation: "Inclusion means creating opportunities for everyone to participate fairly." },
          { question: "Which law protects the rights of persons with disabilities in India?", options: ["Rights of Persons with Disabilities Act, 2016", "RTE Act only", "POCSO Act", "National Food Security Act"], correctIndex: 0, explanation: "The RPwD Act, 2016 provides a legal framework for the rights of persons with disabilities." },
        ],
      },
      // MODULE 6: My Play & Privacy
      {
        moduleId: bySlug("my-play-and-privacy")._id,
        questions: [
          { question: "Why is play important?", options: ["It can support physical, social and creative development", "It has no value", "It prevents learning", "It is only for adults"], correctIndex: 0, explanation: "Play supports physical activity, creativity, teamwork and social development." },
          { question: "Which is an example of recreation?", options: ["Playing football", "Being forced to work", "Being bullied", "Skipping all sleep"], correctIndex: 0, explanation: "Playing football is a healthy recreational activity for children." },
          { question: "Which UNCRC article is associated with play and recreation?", options: ["Article 31", "Article 2", "Article 7", "Article 50"], correctIndex: 0, explanation: "UNCRC Article 31 recognises children's right to rest, leisure, play and recreation." },
          { question: "Children need rest as well as study and activities.", options: ["True", "False", "Maybe", "Not sure"], correctIndex: 0, explanation: "Rest is essential for children's well-being alongside study and activities." },
          { question: "What can children learn through team sports?", options: ["Teamwork and cooperation", "Only mathematics", "Nothing", "How to avoid everyone"], correctIndex: 0, explanation: "Team sports teach valuable skills like teamwork, cooperation and communication." },
          { question: "Which information should normally be kept private?", options: ["Only passwords", "Only home address", "Only phone number", "All of the above"], correctIndex: 3, explanation: "Passwords, home address, phone number and other personal information should all be kept private." },
          { question: "Someone online asks for your password. What should you do?", options: ["Share it", "Tell a trusted adult and do not share it", "Post it publicly", "Send it to everyone"], correctIndex: 1, explanation: "Never share passwords with strangers. Tell a trusted adult about suspicious requests." },
          { question: "What is a good online safety habit?", options: ["Sharing your live location with strangers", "Keeping passwords private", "Posting personal documents publicly", "Sharing every personal detail"], correctIndex: 1, explanation: "Keeping passwords private is an essential online safety habit." },
          { question: "You should think before sharing personal information online.", options: ["True", "False", "Maybe", "Not sure"], correctIndex: 0, explanation: "Always think carefully before sharing any personal information online." },
          { question: "Which Indian law provides a legal framework concerning digital personal data?", options: ["Digital Personal Data Protection Act, 2023", "RTE Act", "POCSO Act", "Child Labour Act"], correctIndex: 0, explanation: "The DPDP Act, 2023 provides the legal framework for digital personal data protection in India." },
        ],
      },
    ];

    await Quiz.insertMany(quizzes);

    // ==========================================
    // KNOWLEDGE ARTICLES — 15 Real-Life Stories
    // ==========================================
    console.log("Inserting knowledge articles...");
    const articles = [
      { title: "Breaking the Vicious Cycle to Save Children from Trafficking", category: "article", content: "Dharmender was a 16-year-old boy from Bihar who was lured away from his home with promises that he could continue his studies and earn money through 'light work.' Instead, he was trafficked for labour.\n\nHe was eventually rescued through an operation involving authorities. After returning home, he was able to continue his education and rebuild his life.\n\nThis real story shows why children need protection from trafficking, exploitation and harmful labour.\n\nWhat children can learn: Every child has the right to be safe. If a child is being exploited, forced to work or taken away through false promises, trusted adults and authorities should help protect the child.", source: "UNICEF India", sourceUrl: "https://www.unicef.org/india/stories/breaking-vicious-cycle-save-children-trafficking", tags: ["protection", "trafficking", "safety"], moduleSlug: "my-safety-and-identity" },
      { title: "Why Birth Registration Matters for Every Child", category: "article", content: "UNICEF explains that millions of children around the world do not have an official record of their birth. Without birth registration, a child may have difficulty proving who they are, where they were born and when they were born.\n\nBirth registration creates an official record of a child's existence and provides legal recognition of their identity. A birth certificate can also help children access important services such as education and healthcare.\n\nWhat children can learn: Your identity matters. Having your birth officially registered helps make sure that you are recognized and protected by the law.", source: "UNICEF", sourceUrl: "https://www.unicef.org/stories/birth-registration?limit=all", tags: ["identity", "birth-registration", "rights"], moduleSlug: "my-safety-and-identity" },
      { title: "Every Child Deserves to Survive – Rishitha's Story", category: "article", content: "Rishitha was born weighing only 650 grams and needed intensive medical care. She spent 156 days receiving treatment and care in hospital.\n\nWith specialized medical support and care, Rishitha survived and grew into an active child.\n\nHer story shows how medical care, nutrition and support can help vulnerable children survive and grow.\n\nWhat children can learn: Every child deserves a chance to survive, receive healthcare and grow in a safe and caring environment.", source: "UNICEF India", sourceUrl: "https://www.unicef.org/india/stories/every-child-deserves-survive", tags: ["survival", "healthcare", "newborn"], moduleSlug: "my-life-and-wellbeing" },
      { title: "Reaching Out to the Unreached – Vaccination in Maharashtra", category: "article", content: "In Maharashtra, some children from marginalized nomadic communities were missing routine vaccinations because their families lived in temporary settlements and were outside the regular healthcare network.\n\nUNICEF worked with the Maharashtra Government and frontline health workers to reach these communities. Health workers repeatedly visited settlements, spoke with families and helped children receive routine immunization.\n\nWhat children can learn: Healthcare should reach every child, including children living in remote, temporary or difficult-to-reach communities.", source: "UNICEF India", sourceUrl: "https://www.unicef.org/india/stories/reaching-out-unreached", tags: ["health", "vaccination", "inclusion"], moduleSlug: "my-life-and-wellbeing" },
      { title: "Geeta Didi – Improving Children's Health Through Nutrition", category: "article", content: "Geeta Yadav is an Anganwadi worker in Chhattisgarh. She works with young children and helps identify children who are suffering from malnutrition.\n\nThrough community-based care and nutrition support, children such as Sourabh received attention and support to improve their health and growth.\n\nWhat children can learn: Nutritious food and timely care are important for healthy growth. Community workers, families and health services can work together to support children who need nutritional help.", source: "UNICEF India", sourceUrl: "https://www.unicef.org/india/stories/geeta-didi-improved-health-malnourished-children-through-nutrition", tags: ["nutrition", "health", "community"], moduleSlug: "my-life-and-wellbeing" },
      { title: "UNICEF's Work on Water, Sanitation and Hygiene in India", category: "article", content: "UNICEF has worked with the Government of India and partners for many years to improve access to clean water, toilets and hygiene.\n\nOne example is the 1966 Bihar drought. During the severe water shortage, UNICEF provided drilling equipment to help increase access to safe drinking water.\n\nUNICEF has also supported programmes promoting toilets, handwashing and safe hygiene practices.\n\nWhat children can learn: Clean water, toilets and good hygiene are important for health, dignity and a safe childhood.", source: "UNICEF India", sourceUrl: "https://www.unicef.org/india/stories/history-unicef-work-water-sanitation-and-hygiene-india", tags: ["water", "sanitation", "hygiene"], moduleSlug: "my-life-and-wellbeing" },
      { title: "Play to Learn – Supporting Children's Growth", category: "article", content: "UNICEF describes how teachers in India are using play, stories, games, art, movement and group activities to support children's learning and development.\n\nFor younger children, teachers use storytelling, puppets, matching games and movement. Older children can learn through group activities, experiments, problem-solving and discussions.\n\nWhat children can learn: Development is not only about getting marks. Children also develop through play, creativity, communication, curiosity, teamwork and problem-solving.", source: "UNICEF India", sourceUrl: "https://www.unicef.org/india/stories/play-learn-practical-tips-teachers-support-childrens-growth", tags: ["development", "play", "learning"], moduleSlug: "my-learning-and-growth" },
      { title: "What Happens When Classrooms Speak Your Language?", category: "article", content: "Savitri Pingwa is a seven-year-old girl from Odisha. She speaks Ho, a language used by many people in her community.\n\nAt school, she initially struggled because the learning materials were mainly in Odia, which she did not understand well.\n\nA multilingual education programme introduced learning materials using children's familiar languages. Savitri became more confident and participated more actively in class.\n\nWhat children can learn: Every child deserves an education where they can understand, participate and learn with confidence. A child's language and culture should be respected.", source: "UNICEF India", sourceUrl: "https://www.unicef.org/india/stories/what-happens-when-classrooms-speak-your-language", tags: ["education", "language", "inclusion"], moduleSlug: "my-learning-and-growth" },
      { title: "Empowering Children through Child-Friendly Panchayats", category: "article", content: "In Rajasthan, Child-Friendly Gram Panchayats give children opportunities to participate through Bal Panchayats and Bal Sabhas.\n\nChildren and young people between the ages of 10 and 18 have discussed issues affecting their lives, including education, child marriage and environmental problems.\n\nWhat children can learn: Children can have meaningful opportunities to share their opinions and participate in discussions about issues that affect them.", source: "UNICEF India", sourceUrl: "https://www.unicef.org/india/stories/empowering-children-through-child-friendly-panchayats-rajasthan", tags: ["participation", "panchayat", "voice"], moduleSlug: "my-voice-and-freedom" },
      { title: "West Bengal's Community Youth Reporters Drive Social Change", category: "article", content: "In West Bengal, young people were trained through the Community Youth Reporter Programme.\n\nThese young reporters use storytelling and communication to discuss issues affecting their communities, including child marriage, environmental problems and educational opportunities.\n\nThey share information, raise awareness and bring attention to issues that matter to young people.\n\nWhat children can learn: Your voice matters. You can use communication, storytelling and responsible expression to share ideas and raise awareness about problems around you.", source: "UNICEF India", sourceUrl: "https://www.unicef.org/india/stories/west-bengals-community-youth-reporters-drive-social-change", tags: ["expression", "youth", "media"], moduleSlug: "my-voice-and-freedom" },
      { title: "Divided by Fortune, United by Family", category: "article", content: "Four siblings in Udaipur lost both of their parents and were later moved to a government Child Care Institution.\n\nA foster-care programme helped provide a family environment for children who needed care and protection.\n\nThe story highlights the importance of providing children with safety, care, support and a nurturing environment when they cannot safely live with their parents.\n\nWhat children can learn: Every child deserves care, safety, support and an environment where they can grow and feel protected.", source: "UNICEF India", sourceUrl: "https://www.unicef.org/india/stories/divided-fortune-united-family", tags: ["family", "care", "foster"], moduleSlug: "my-family-equality-and-inclusion" },
      { title: "From Classroom to Change – Challenging Gender Bias", category: "article", content: "Tannu Kumari is a 17-year-old student from Jharkhand. After reading the Aadha Full comic series, she began thinking more deeply about unfair gender expectations.\n\nShe started questioning situations where boys and girls were treated differently and encouraged other girls to continue their education.\n\nWhat children can learn: Everyone deserves equal opportunities. A person's gender should not decide whether they can learn, participate, dream or achieve their goals.", source: "UNICEF India", sourceUrl: "https://www.unicef.org/india/stories/classroom-change-how-student-challenged-gender-bias", tags: ["equality", "gender", "education"], moduleSlug: "my-family-equality-and-inclusion" },
      { title: "Viraj's Inspiring Journey Through Inclusive Education", category: "article", content: "Viraj is a student from Gujarat who faced learning challenges associated with autism.\n\nHis school, teachers, special educators and parents worked together to create a supportive learning environment. The school introduced measures such as sensory breaks and personalized support.\n\nViraj was able to participate in school life and learn alongside his peers.\n\nWhat children can learn: Inclusion means making sure children with disabilities can participate, learn and develop with appropriate support.", source: "UNICEF India", sourceUrl: "https://www.unicef.org/india/stories/virajs-inspiring-journey-through-inclusive-education-vadodara-primary-school", tags: ["disability", "inclusion", "education"], moduleSlug: "my-family-equality-and-inclusion" },
      { title: "The Science of Play", category: "article", content: "UNICEF explains how play helps children learn, explore their surroundings, solve problems, express ideas and develop relationships.\n\nPlay is not simply entertainment. It can help children build important social, emotional, physical and thinking skills.\n\nWhat children can learn: Playing is an important part of growing and learning. Children need opportunities to play, explore, create and interact with others.", source: "UNICEF India", sourceUrl: "https://www.unicef.org/india/stories/science-play", tags: ["play", "development", "recreation"], moduleSlug: "my-play-and-privacy" },
      { title: "Online Safety for Children and Adolescents", category: "article", content: "UNICEF explains that children use the internet for learning, communication, games and creativity, but the online world can also create risks.\n\nChildren may face problems such as contact from strangers, unsafe sharing of information and privacy risks.\n\nUNICEF recommends that children protect their passwords, use privacy settings, think before sharing photographs or personal information, and talk to a trusted adult when something online makes them uncomfortable.\n\nWhat children can learn: Your personal information is important. Think before sharing information online and ask a trusted adult for help when something feels unsafe.", source: "UNICEF India", sourceUrl: "https://www.unicef.org/india/stories/online-safety-children-and-adolescents", tags: ["privacy", "online-safety", "digital"], moduleSlug: "my-play-and-privacy" },
    ];

    // ==========================================
    // KNOWLEDGE FAQs — 30 Source-Backed FAQs
    // ==========================================
    const faqs = [
      // Module 1
      { title: "What is physical violence against children?", category: "faq", content: "Physical violence includes hitting or physically hurting a child. It can also include actions such as kicking, shaking, biting, pinching or using physical force as punishment.", source: "UNICEF India", sourceUrl: "https://www.unicef.org/india/faqs-end-violence", tags: ["protection", "violence"], moduleSlug: "my-safety-and-identity" },
      { title: "What is sexual violence against children?", category: "faq", content: "Sexual violence includes sexual activities forced or imposed on a child. Children have the right to protection from sexual violence and exploitation.", source: "UNICEF India", sourceUrl: "https://www.unicef.org/india/faqs-end-violence", tags: ["protection", "safety"], moduleSlug: "my-safety-and-identity" },
      { title: "What should a child do if they feel unsafe?", category: "faq", content: "A child should tell a trusted adult such as a parent, teacher, guardian or another responsible adult who can help them.", source: "UNICEF India", sourceUrl: "https://www.unicef.org/india/stories/online-safety-children-and-adolescents", tags: ["safety", "help"], moduleSlug: "my-safety-and-identity" },
      { title: "What is birth registration?", category: "faq", content: "Birth registration is the official process of recording a child's birth. It creates a permanent official record of the child's existence and provides legal recognition of their identity.", source: "UNICEF", sourceUrl: "https://www.unicef.org/stories/birth-registration?limit=all", tags: ["identity", "birth"], moduleSlug: "my-safety-and-identity" },
      { title: "Why is birth registration important?", category: "faq", content: "Birth registration helps prove a child's identity and age. It can also help children access important services such as healthcare and education and can provide protection against exploitation.", source: "UNICEF", sourceUrl: "https://www.unicef.org/stories/birth-registration?limit=all", tags: ["identity", "rights"], moduleSlug: "my-safety-and-identity" },
      // Module 2
      { title: "Do children have the right to life, survival and development?", category: "faq", content: "Yes. The Convention on the Rights of the Child recognizes a child's inherent right to life and says that governments should support children's survival and development.", source: "UNICEF", sourceUrl: "https://www.unicef.org/stories/child-rights-convention-faq", tags: ["survival", "rights"], moduleSlug: "my-life-and-wellbeing" },
      { title: "What is immunization?", category: "faq", content: "Immunization is when a child receives vaccines through injections or oral doses to help develop protection against certain infectious diseases.", source: "UNICEF India", sourceUrl: "https://www.unicef.org/india/stories/frequently-asked-questions-immunization-children", tags: ["health", "vaccination"], moduleSlug: "my-life-and-wellbeing" },
      { title: "Where can children receive routine vaccinations in India?", category: "faq", content: "Children can receive routine vaccinations at government health facilities such as hospitals, Primary Health Centres, Community Health Centres, sub-centres and Anganwadi Centres.", source: "UNICEF India", sourceUrl: "https://www.unicef.org/india/stories/frequently-asked-questions-immunization-children", tags: ["health", "vaccination"], moduleSlug: "my-life-and-wellbeing" },
      { title: "What is anaemia?", category: "faq", content: "Anaemia is a condition in which the blood does not have enough healthy red blood cells or haemoglobin to carry enough oxygen around the body. It can make a person feel tired or weak.", source: "UNICEF India", sourceUrl: "https://www.unicef.org/india/frequently-asked-questions-anaemia", tags: ["health", "nutrition"], moduleSlug: "my-life-and-wellbeing" },
      { title: "What is ODF?", category: "faq", content: "ODF means Open Defecation Free. It describes a situation where people do not defecate in the open and use toilets instead.", source: "UNICEF India", sourceUrl: "https://www.unicef.org/india/faqs-open-defecation-free-plus-odf-and-sanitation", tags: ["sanitation", "hygiene"], moduleSlug: "my-life-and-wellbeing" },
      { title: "Why are clean toilets important for children?", category: "faq", content: "Safe sanitation can help reduce disease, support children's health and improve school attendance. Clean and safe toilets also support children's safety, dignity and privacy.", source: "UNICEF India", sourceUrl: "https://www.unicef.org/india/faqs-open-defecation-free-plus-odf-and-sanitation", tags: ["sanitation", "health"], moduleSlug: "my-life-and-wellbeing" },
      // Module 3
      { title: "What are the guiding principles of the UNCRC?", category: "faq", content: "Important principles include non-discrimination, the best interests of the child, the right to life, survival and development, and the right of children to express their views.", source: "UNICEF", sourceUrl: "https://www.unicef.org/stories/child-rights-convention-faq", tags: ["development", "UNCRC"], moduleSlug: "my-learning-and-growth" },
      { title: "Why is play important for children's development?", category: "faq", content: "Play helps children explore, solve problems, express ideas, develop relationships and build social and emotional skills.", source: "UNICEF India", sourceUrl: "https://www.unicef.org/india/stories/science-play", tags: ["development", "play"], moduleSlug: "my-learning-and-growth" },
      { title: "What does RTE stand for?", category: "faq", content: "RTE stands for the Right of Children to Free and Compulsory Education Act, 2009.", source: "CBSE", sourceUrl: "https://www.cbse.gov.in/cbsenew/documents/FAQ_RTE_21022022.pdf", tags: ["education", "RTE"], moduleSlug: "my-learning-and-growth" },
      { title: "Which age group is covered by the RTE Act?", category: "faq", content: "The RTE Act provides for free and compulsory elementary education for children between 6 and 14 years of age.", source: "CBSE", sourceUrl: "https://www.cbse.gov.in/cbsenew/documents/FAQ_RTE_21022022.pdf", tags: ["education", "RTE"], moduleSlug: "my-learning-and-growth" },
      // Module 4
      { title: "Do children have the right to express their views?", category: "faq", content: "Yes. The Convention on the Rights of the Child recognizes that children have the right to express their views freely in matters that affect them. Their views should be given appropriate consideration according to their age and maturity.", source: "UNICEF", sourceUrl: "https://www.unicef.org/stories/child-rights-convention-faq", tags: ["participation", "voice"], moduleSlug: "my-voice-and-freedom" },
      { title: "Does participation mean adults must always agree with children?", category: "faq", content: "No. Participation means that children should have opportunities to share their views and that adults should listen to and consider those views appropriately.", source: "UNICEF", sourceUrl: "https://www.unicef.org/stories/child-rights-convention-faq", tags: ["participation", "voice"], moduleSlug: "my-voice-and-freedom" },
      { title: "What does freedom of expression mean for children?", category: "faq", content: "It means children can share their thoughts, ideas and opinions while respecting the rights, safety and dignity of other people.", source: "UNICEF", sourceUrl: "https://www.unicef.org/stories/child-rights-convention-faq", tags: ["expression", "freedom"], moduleSlug: "my-voice-and-freedom" },
      { title: "Can young people use their voices to bring attention to problems?", category: "faq", content: "Yes. UNICEF-supported youth programmes show how young people can use storytelling, communication and community activities to raise awareness about issues that affect them.", source: "UNICEF India", sourceUrl: "https://www.unicef.org/india/stories/west-bengals-community-youth-reporters-drive-social-change", tags: ["expression", "youth"], moduleSlug: "my-voice-and-freedom" },
      // Module 5
      { title: "Why is family care important for children?", category: "faq", content: "Children need safe, caring and supportive environments where they can grow, learn and develop. Family and caregivers can play an important role in providing this support.", source: "UNICEF", sourceUrl: "https://www.unicef.org/stories/child-rights-convention-faq", tags: ["family", "care"], moduleSlug: "my-family-equality-and-inclusion" },
      { title: "What happens when a child cannot safely live with their parents?", category: "faq", content: "A child may need alternative care and protection. Decisions should focus on the child's safety, care, well-being and best interests.", source: "UNICEF India", sourceUrl: "https://www.unicef.org/india/stories/divided-fortune-united-family", tags: ["family", "care"], moduleSlug: "my-family-equality-and-inclusion" },
      { title: "What does non-discrimination mean?", category: "faq", content: "Non-discrimination means that children should be able to enjoy their rights without unfair discrimination.", source: "UNICEF", sourceUrl: "https://www.unicef.org/stories/child-rights-convention-faq", tags: ["equality", "rights"], moduleSlug: "my-family-equality-and-inclusion" },
      { title: "Should boys and girls have equal opportunities?", category: "faq", content: "Yes. Every child should have opportunities to learn, develop, participate and reach their potential without unfair gender discrimination.", source: "UNICEF India", sourceUrl: "https://www.unicef.org/india/what-we-do/gender-equality", tags: ["equality", "gender"], moduleSlug: "my-family-equality-and-inclusion" },
      { title: "What does inclusive education mean?", category: "faq", content: "Inclusive education means creating learning environments where children with disabilities can learn and participate alongside other children with appropriate support.", source: "UNICEF", sourceUrl: "https://www.unicef.org/education/inclusive-education", tags: ["disability", "inclusion"], moduleSlug: "my-family-equality-and-inclusion" },
      { title: "Should children with disabilities be given opportunities to participate in school?", category: "faq", content: "Yes. Children with disabilities have the same dignity and rights as other children. Schools should work to remove barriers and provide appropriate support so they can participate and learn.", source: "UNICEF", sourceUrl: "https://www.unicef.org/education/inclusive-education", tags: ["disability", "inclusion"], moduleSlug: "my-family-equality-and-inclusion" },
      // Module 6
      { title: "Why is play important?", category: "faq", content: "Play helps children learn, explore, solve problems, express ideas, build relationships and develop social and emotional skills.", source: "UNICEF India", sourceUrl: "https://www.unicef.org/india/stories/science-play", tags: ["play", "development"], moduleSlug: "my-play-and-privacy" },
      { title: "Is play only about entertainment?", category: "faq", content: "No. Play can support learning, creativity, communication, problem-solving and healthy development.", source: "UNICEF India", sourceUrl: "https://www.unicef.org/india/stories/science-play", tags: ["play", "recreation"], moduleSlug: "my-play-and-privacy" },
      { title: "Should children share their passwords with strangers online?", category: "faq", content: "No. Children should keep their passwords private and use safe privacy settings.", source: "UNICEF India", sourceUrl: "https://www.unicef.org/india/stories/online-safety-children-and-adolescents", tags: ["privacy", "safety"], moduleSlug: "my-play-and-privacy" },
      { title: "What should a child do if something online makes them uncomfortable?", category: "faq", content: "Tell a trusted adult and seek help. Children should not feel that they have to deal with an unsafe online situation alone.", source: "UNICEF India", sourceUrl: "https://www.unicef.org/india/stories/online-safety-children-and-adolescents", tags: ["privacy", "safety"], moduleSlug: "my-play-and-privacy" },
      { title: "What is India's law concerning digital personal data?", category: "faq", content: "India has the Digital Personal Data Protection Act, 2023, which provides a legal framework concerning the processing and protection of digital personal data.", source: "Government of India", sourceUrl: "https://www.meity.gov.in/", tags: ["privacy", "law"], moduleSlug: "my-play-and-privacy" },
    ];

    await KnowledgeArticle.insertMany([...articles, ...faqs]);

    console.log("✅ Seed complete!");
    console.log(`   📦 ${modules.length} modules`);
    console.log(`   📝 ${quizzes.length} quizzes (${quizzes.reduce((s, q) => s + q.questions.length, 0)} questions)`);
    console.log(`   📰 ${articles.length} articles + ${faqs.length} FAQs`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedData();
