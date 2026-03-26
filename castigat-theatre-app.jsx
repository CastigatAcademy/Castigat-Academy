import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Star, Lock, CheckCircle, ChevronRight, ChevronLeft, Trophy, Flame,
  BookOpen, Mic, Camera, Play, Heart, Award, Zap, Target, Music,
  Users, Clock, MapPin, X, Volume2, Eye, Hand, MessageCircle,
  Crown, Shield, Sparkles, TrendingUp, Home, User, Settings,
  ArrowRight, RotateCcw, Upload, ThumbsUp, Info
} from "lucide-react";

// ─── DATA ──────────────────────────────────────────────────────────────────

const LEVELS = [
  { id: "debutant", name: "Débutant", icon: "🌱", color: "from-emerald-400 to-emerald-600", xpRequired: 0 },
  { id: "intermediaire", name: "Intermédiaire", icon: "🎭", color: "from-blue-400 to-blue-600", xpRequired: 500 },
  { id: "avance", name: "Avancé", icon: "⭐", color: "from-purple-400 to-purple-600", xpRequired: 1500 },
  { id: "pro", name: "Pro", icon: "👑", color: "from-amber-400 to-amber-600", xpRequired: 3000 },
];

const QUIZ_QUESTIONS = [
  {
    question: "Avez-vous déjà pratiqué le théâtre ?",
    options: ["Jamais", "Quelques ateliers", "Plusieurs années", "Formation professionnelle"],
    scores: [0, 1, 2, 3],
  },
  {
    question: "Connaissez-vous la méthode Stanislavski ?",
    options: ["Pas du tout", "De nom", "J'en connais les grandes lignes", "Je la pratique"],
    scores: [0, 1, 2, 3],
  },
  {
    question: "Avez-vous déjà joué devant un public ?",
    options: ["Jamais", "En amateur", "Régulièrement", "Professionnellement"],
    scores: [0, 1, 2, 3],
  },
  {
    question: "Comment qualifieriez-vous votre aisance corporelle sur scène ?",
    options: ["Très timide", "Un peu à l'aise", "Assez confiant·e", "Très à l'aise"],
    scores: [0, 1, 2, 3],
  },
  {
    question: "Quel est votre objectif principal ?",
    options: ["Vaincre ma timidité", "Pratiquer un loisir", "Me perfectionner", "En faire mon métier"],
    scores: [0, 1, 2, 3],
  },
];

const PRACTICE_MODULES = {
  debutant: [
    {
      id: "respiration-1", title: "Respiration abdominale", category: "Respiration", icon: "🫁",
      duration: "10 min", xp: 30, type: "exercise",
      steps: [
        "Allongez-vous ou asseyez-vous confortablement, dos droit.",
        "Posez une main sur le ventre, l'autre sur la poitrine.",
        "Inspirez lentement par le nez (4 secondes) : seul le ventre se gonfle.",
        "Expirez par la bouche (6 secondes) : le ventre redescend.",
        "Répétez 10 fois. Sentez le calme s'installer.",
      ],
      tip: "La respiration abdominale est la base de toute projection vocale. Les grands acteurs la pratiquent quotidiennement."
    },
    {
      id: "diction-1", title: "Virelangues faciles", category: "Diction", icon: "🗣️",
      duration: "8 min", xp: 25, type: "exercise",
      steps: [
        "Échauffez votre mâchoire : ouvrez grand la bouche 5 fois.",
        "Prononcez lentement : « Les chaussettes de l'archiduchesse sont-elles sèches ? »",
        "Accélérez progressivement en gardant chaque syllabe claire.",
        "Essayez : « Un chasseur sachant chasser sait chasser sans son chien. »",
        "Terminez par : « Panier piano panier piano » en boucle, de plus en plus vite.",
      ],
      tip: "Sarah Bernhardt pratiquait ses virelangues chaque matin avant d'entrer en scène."
    },
    {
      id: "corps-1", title: "Ancrage au sol", category: "Corps", icon: "🧍",
      duration: "12 min", xp: 35, type: "exercise",
      steps: [
        "Debout, pieds écartés largeur du bassin.",
        "Fermez les yeux. Sentez vos pieds sur le sol, répartissez le poids.",
        "Imaginez des racines qui poussent de vos pieds vers le centre de la terre.",
        "Balancez-vous doucement d'avant en arrière, puis trouvez votre centre.",
        "Ouvrez les yeux. Marchez lentement dans la pièce en gardant cette sensation d'ancrage.",
      ],
      tip: "L'ancrage est le secret de la présence scénique. Un acteur ancré capte immédiatement l'attention."
    },
    {
      id: "intention-1", title: "Les émotions de base", category: "Intentions", icon: "🎭",
      duration: "15 min", xp: 40, type: "exercise",
      steps: [
        "Choisissez la phrase : « Il fait beau aujourd'hui. »",
        "Dites-la avec JOIE : souriez, les yeux pétillent.",
        "Dites-la avec TRISTESSE : voix basse, regard au sol.",
        "Dites-la avec COLÈRE : mâchoire serrée, ton ferme.",
        "Dites-la avec SURPRISE : yeux grands ouverts, bouche en O.",
        "Observez comment votre corps change avec chaque émotion.",
      ],
      tip: "Une même phrase peut avoir mille sens. C'est la base du sous-texte, cher à Stanislavski."
    },
    {
      id: "monologue-1", title: "Mon premier monologue", category: "Monologue", icon: "🎬",
      duration: "20 min", xp: 80, type: "video",
      text: "« Être ou ne pas être, telle est la question. Est-il plus noble pour l'âme de souffrir les coups et les flèches de la fortune outrageante, ou de prendre les armes contre une mer de tourments et, en les affrontant, d'y mettre fin ? »",
      author: "Shakespeare — Hamlet (Acte III, Scène 1)",
      instructions: [
        "Lisez le texte à voix haute 3 fois pour vous l'approprier.",
        "Identifiez l'intention principale : Hamlet hésite entre agir et subir.",
        "Travaillez la respiration : prenez le temps des pauses.",
        "Filmez-vous en plan moyen (de la taille à la tête).",
        "Envoyez votre vidéo pour recevoir un retour personnalisé d'un coach.",
      ],
      premium: false,
    },
  ],
  intermediaire: [
    {
      id: "respiration-2", title: "Projection vocale", category: "Respiration", icon: "🫁",
      duration: "12 min", xp: 45, type: "exercise",
      steps: [
        "Inspirez profondément en gonflant le ventre.",
        "Sur l'expiration, lancez un « HAAAA » en visant le mur opposé.",
        "Variez les distances : projetez à 1m, 3m, 10m, 20m.",
        "Gardez la gorge ouverte — le son vient du diaphragme, pas de la gorge.",
        "Essayez avec une phrase : « Je suis ici et je prends ma place ! »",
      ],
      tip: "Au Théâtre du Soleil, les acteurs s'entraînent à projeter leur voix dans des espaces immenses sans micro."
    },
    {
      id: "corps-2", title: "Les qualités de mouvement", category: "Corps", icon: "🧍",
      duration: "15 min", xp: 50, type: "exercise",
      steps: [
        "Marchez normalement dans la pièce.",
        "Passez en mouvement FLUIDE : imaginez que vous êtes sous l'eau.",
        "Passez en mouvement SACCADÉ : comme un robot ou une marionnette.",
        "Essayez le LOURD : chaque pas pèse une tonne.",
        "Terminez par le LÉGER : vous flottez, à peine effleurez-vous le sol.",
        "Créez un personnage pour chaque qualité.",
      ],
      tip: "Jacques Lecoq a bâti toute sa pédagogie sur l'exploration des qualités de mouvement."
    },
    {
      id: "monologue-2", title: "Monologue classique", category: "Monologue", icon: "🎬",
      duration: "25 min", xp: 100, type: "video",
      text: "« Je ne suis pas ce que je suis ! Que ces mots résonnent dans votre esprit. Car le théâtre est l'art de devenir autre, de se perdre pour mieux se retrouver. Chaque personnage que j'incarne me révèle à moi-même une vérité que j'ignorais. »",
      author: "Exercice d'écriture personnelle — Castigat",
      instructions: [
        "Apprenez le texte par cœur (pas de lecture).",
        "Trouvez 3 intentions différentes dans le texte.",
        "Travaillez les ruptures de rythme et les silences.",
        "Filmez 2 versions avec des choix d'interprétation différents.",
        "Envoyez les deux versions pour un retour comparatif.",
      ],
      premium: true,
    },
  ],
  avance: [
    {
      id: "scene-1", title: "Travail de scène à deux", category: "Scène", icon: "🎭",
      duration: "30 min", xp: 120, type: "exercise",
      steps: [
        "Choisissez une scène à deux personnages (nous vous en proposons).",
        "Travaillez d'abord votre personnage seul : qui est-il ? Que veut-il ?",
        "Lisez la scène avec un partenaire (ou enregistrez les deux rôles).",
        "Concentrez-vous sur l'ÉCOUTE : réagissez vraiment à ce que dit l'autre.",
        "La scène vit dans les silences autant que dans les mots.",
      ],
      tip: "Ariane Mnouchkine dit : « Le théâtre, c'est l'art de l'écoute avant d'être l'art de la parole. »"
    },
    {
      id: "monologue-3", title: "Monologue contemporain", category: "Monologue", icon: "🎬",
      duration: "30 min", xp: 150, type: "video",
      text: "« Tu sais ce que c'est, toi, la solitude ? C'est pas être seul dans une pièce. C'est être entouré de gens et sentir que personne — personne — ne te voit vraiment. Alors tu joues. Tu joues tellement bien que tu finis par oublier qui tu es sous le masque. »",
      author: "Texte contemporain — Castigat",
      instructions: [
        "Appropriez-vous le texte : réécrivez-le avec vos mots d'abord.",
        "Trouvez votre connexion personnelle avec le propos.",
        "Travaillez la vérité de l'émotion — pas le jeu, la vérité.",
        "Filmez en plan serré (visage) pour capter les micro-expressions.",
        "Un metteur en scène vous donnera un retour détaillé sous 48h.",
      ],
      premium: true,
    },
  ],
  pro: [
    {
      id: "casting-1", title: "Préparation au casting", category: "Pro", icon: "🎬",
      duration: "45 min", xp: 200, type: "exercise",
      steps: [
        "Analysez le texte de casting fourni (personnage, enjeux, ton).",
        "Préparez 2 propositions radicalement différentes.",
        "Travaillez votre entrée : les 5 premières secondes décident de tout.",
        "Filmez-vous en conditions réelles (caméra fixe, pas de montage).",
        "Gérez le stress : respiration, ancrage, visualisation positive.",
      ],
      tip: "Les directeurs de casting cherchent l'authenticité. Soyez vous-même, en mieux."
    },
  ],
};

const CULTURE_MODULES = {
  debutant: [
    {
      id: "histoire-1", title: "Naissance du théâtre", category: "Histoire", icon: "🏛️",
      duration: "8 min", xp: 20,
      content: [
        { type: "text", value: "Le théâtre naît en Grèce antique, au VIe siècle avant J.-C., lors des fêtes en l'honneur de Dionysos, dieu du vin et de l'extase." },
        { type: "text", value: "Thespis est considéré comme le premier acteur de l'histoire : il s'est détaché du chœur pour incarner un personnage seul. D'où le mot « thespien » pour désigner un acteur." },
        { type: "text", value: "Les trois grands tragiques grecs sont Eschyle (qui a ajouté un deuxième acteur), Sophocle (qui en a ajouté un troisième) et Euripide (qui a humanisé les personnages)." },
        { type: "text", value: "La comédie naît avec Aristophane, maître de la satire politique. Ses pièces se moquaient ouvertement des dirigeants athéniens !" },
      ],
      quiz: [
        { q: "Où est né le théâtre occidental ?", options: ["Rome", "Grèce", "Égypte", "Mésopotamie"], correct: 1 },
        { q: "Qui est considéré comme le premier acteur ?", options: ["Sophocle", "Aristophane", "Thespis", "Euripide"], correct: 2 },
        { q: "Combien de grands tragiques grecs retient-on ?", options: ["2", "3", "4", "5"], correct: 1 },
      ],
    },
    {
      id: "auteurs-1", title: "Molière, le patron", category: "Auteurs", icon: "✒️",
      duration: "10 min", xp: 25,
      content: [
        { type: "text", value: "Jean-Baptiste Poquelin, dit Molière (1622-1673), est LE dramaturge français par excellence. Acteur, metteur en scène et auteur, il a inventé la comédie moderne." },
        { type: "text", value: "Ses chefs-d'œuvre — Le Misanthrope, Tartuffe, L'Avare, Le Malade imaginaire — dénoncent l'hypocrisie, l'avarice et la vanité avec un humour féroce." },
        { type: "text", value: "Molière est mort sur scène (ou presque) : il s'est effondré lors de la 4e représentation du Malade imaginaire le 17 février 1673, et est décédé quelques heures plus tard." },
        { type: "text", value: "Aujourd'hui encore, la Comédie-Française s'appelle « la Maison de Molière ». Sa langue reste étonnamment moderne et drôle." },
      ],
      quiz: [
        { q: "Quel est le vrai nom de Molière ?", options: ["Jean Racine", "Jean-Baptiste Poquelin", "Pierre Corneille", "Denis Diderot"], correct: 1 },
        { q: "Dans quelle pièce Molière jouait-il lors de sa mort ?", options: ["Tartuffe", "L'Avare", "Le Malade imaginaire", "Le Misanthrope"], correct: 2 },
        { q: "Comment appelle-t-on la Comédie-Française ?", options: ["Le Palais Royal", "La Maison de Molière", "Le Théâtre du Soleil", "L'Odéon"], correct: 1 },
      ],
    },
    {
      id: "technique-1", title: "Le quatrième mur", category: "Techniques", icon: "🧱",
      duration: "6 min", xp: 15,
      content: [
        { type: "text", value: "Le « quatrième mur » est un concept fondamental du théâtre. Imaginez la scène comme une boîte ouverte : trois murs existent vraiment, et le quatrième — celui qui donne sur le public — est invisible." },
        { type: "text", value: "Denis Diderot a théorisé ce concept au XVIIIe siècle : les acteurs jouent comme si le public n'existait pas, ce qui crée l'illusion de la réalité." },
        { type: "text", value: "Bertolt Brecht, au XXe siècle, a volontairement cassé ce mur : dans son « théâtre épique », les acteurs s'adressent directement au public pour le faire réfléchir plutôt que de le bercer d'illusions." },
      ],
      quiz: [
        { q: "Qui a théorisé le quatrième mur ?", options: ["Molière", "Brecht", "Diderot", "Stanislavski"], correct: 2 },
        { q: "Que fait Brecht avec le quatrième mur ?", options: ["Il le renforce", "Il le casse", "Il l'ignore", "Il le décore"], correct: 1 },
      ],
    },
  ],
  intermediaire: [
    {
      id: "technique-2", title: "La méthode Stanislavski", category: "Techniques", icon: "🎓",
      duration: "12 min", xp: 35,
      content: [
        { type: "text", value: "Constantin Stanislavski (1863-1938) a révolutionné l'art de l'acteur avec son « système » : la première méthode systématique de formation de l'acteur." },
        { type: "text", value: "Principe central : la « mémoire affective ». L'acteur puise dans ses propres souvenirs émotionnels pour nourrir son personnage. Si votre personnage est triste, rappelez-vous un moment de vraie tristesse." },
        { type: "text", value: "Le « si magique » : « Que ferais-je SI j'étais dans cette situation ? » Cette question simple est la porte d'entrée vers la vérité du jeu." },
        { type: "text", value: "Son héritage est immense : l'Actors Studio de New York (Marlon Brando, Al Pacino, Robert De Niro) est directement issu de ses enseignements." },
      ],
      quiz: [
        { q: "Quel est le principe central de Stanislavski ?", options: ["La distanciation", "La mémoire affective", "Le mime", "L'improvisation"], correct: 1 },
        { q: "Qu'est-ce que le « si magique » ?", options: ["Un tour de magie", "Une question d'identification au personnage", "Un exercice de diction", "Une technique de mime"], correct: 1 },
      ],
    },
    {
      id: "histoire-2", title: "Le théâtre de l'absurde", category: "Histoire", icon: "🌀",
      duration: "10 min", xp: 30,
      content: [
        { type: "text", value: "Après la Seconde Guerre mondiale, des dramaturges expriment le non-sens de l'existence humaine : c'est le théâtre de l'absurde." },
        { type: "text", value: "Samuel Beckett écrit En attendant Godot (1953) : deux hommes attendent quelqu'un qui ne viendra jamais. C'est drôle, tragique et profondément humain." },
        { type: "text", value: "Eugène Ionesco, avec La Cantatrice chauve (1950), dynamite le langage : les mots perdent leur sens, les conversations deviennent absurdes — un miroir de notre société." },
        { type: "text", value: "Ce mouvement a profondément influencé le théâtre contemporain et reste très joué aujourd'hui." },
      ],
      quiz: [
        { q: "Qui a écrit En attendant Godot ?", options: ["Ionesco", "Beckett", "Camus", "Sartre"], correct: 1 },
        { q: "Quand a été créée La Cantatrice chauve ?", options: ["1930", "1950", "1970", "1990"], correct: 1 },
      ],
    },
  ],
  avance: [
    {
      id: "technique-3", title: "Brecht et la distanciation", category: "Techniques", icon: "🔍",
      duration: "15 min", xp: 45,
      content: [
        { type: "text", value: "Bertolt Brecht (1898-1956) s'oppose à Stanislavski. Pour lui, le théâtre ne doit pas créer l'illusion mais éveiller l'esprit critique du spectateur." },
        { type: "text", value: "Le Verfremdungseffekt (effet de distanciation) : l'acteur montre qu'il joue un rôle. Il peut commenter son personnage, s'adresser au public, chanter." },
        { type: "text", value: "Ses pièces (Mère Courage, L'Opéra de quat'sous, La Résistible Ascension d'Arturo Ui) sont des paraboles politiques qui invitent le spectateur à réfléchir et à agir." },
      ],
      quiz: [
        { q: "Quel effet Brecht recherche-t-il ?", options: ["L'identification", "La distanciation", "Le rire", "La catharsis"], correct: 1 },
        { q: "Quelle est la visée principale du théâtre brechtien ?", options: ["Divertir", "Émouvoir", "Éveiller l'esprit critique", "Raconter des histoires"], correct: 2 },
      ],
    },
  ],
  pro: [
    {
      id: "industrie-1", title: "Le métier de comédien", category: "Industrie", icon: "💼",
      duration: "15 min", xp: 50,
      content: [
        { type: "text", value: "Le statut d'intermittent du spectacle est spécifique à la France : il faut cumuler 507 heures de travail sur 12 mois pour en bénéficier." },
        { type: "text", value: "Les castings : envoyez votre CV, votre bande démo et votre photo à des agents. La persévérance est la qualité n°1." },
        { type: "text", value: "Les formations reconnues : le Conservatoire National (CNSAD), l'École du TNS, le Cours Florent, l'ESAD... et bientôt Castigat en ligne !" },
      ],
      quiz: [
        { q: "Combien d'heures faut-il pour le statut d'intermittent ?", options: ["307h", "407h", "507h", "607h"], correct: 2 },
      ],
    },
  ],
};

const BADGES = [
  { id: "first-step", name: "Premier pas", icon: "👣", desc: "Terminer votre premier exercice", condition: (s) => s.completedExercises.length >= 1 },
  { id: "culture-vulture", name: "Rat de bibliothèque", icon: "📚", desc: "Terminer 3 leçons de culture", condition: (s) => s.completedCulture.length >= 3 },
  { id: "dedicated", name: "Assidu·e", icon: "🔥", desc: "Atteindre un streak de 3 jours", condition: (s) => s.streak >= 3 },
  { id: "xp-hunter", name: "Chasseur·se d'XP", icon: "⚡", desc: "Accumuler 200 XP", condition: (s) => s.xp >= 200 },
  { id: "quiz-master", name: "Maître du quiz", icon: "🧠", desc: "Obtenir 100% à un quiz culture", condition: (s) => s.perfectQuizzes >= 1 },
  { id: "rising-star", name: "Étoile montante", icon: "🌟", desc: "Atteindre le niveau Intermédiaire", condition: (s) => s.xp >= 500 },
  { id: "video-star", name: "Face caméra", icon: "🎥", desc: "Soumettre votre premier monologue vidéo", condition: (s) => s.videosSubmitted >= 1 },
  { id: "unstoppable", name: "Inarrêtable", icon: "🚀", desc: "Accumuler 1000 XP", condition: (s) => s.xp >= 1000 },
];

// ─── COMPONENTS ────────────────────────────────────────────────────────────

function ProgressBar({ value, max, color = "bg-amber-400", height = "h-2" }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className={`w-full bg-gray-200 rounded-full ${height} overflow-hidden`}>
      <div className={`${color} ${height} rounded-full transition-all duration-700 ease-out`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function XPBurst({ amount, onDone }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); onDone?.(); }, 1500);
    return () => clearTimeout(t);
  }, []);
  if (!visible) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="animate-bounce text-4xl font-black text-amber-400 drop-shadow-lg">
        +{amount} XP ⚡
      </div>
    </div>
  );
}

function NavBar({ currentTab, setCurrentTab, xp, streak }) {
  const tabs = [
    { id: "home", icon: Home, label: "Accueil" },
    { id: "practice", icon: Mic, label: "Pratique" },
    { id: "culture", icon: BookOpen, label: "Culture" },
    { id: "profile", icon: User, label: "Profil" },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-bottom">
      <div className="max-w-lg mx-auto flex justify-around items-center py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = currentTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setCurrentTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all ${active ? "text-red-600" : "text-gray-400 hover:text-gray-600"}`}>
              <Icon size={22} strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function TopBar({ xp, streak, level }) {
  const currentLevel = LEVELS.filter(l => xp >= l.xpRequired).pop();
  const nextLevel = LEVELS[LEVELS.indexOf(currentLevel) + 1];
  const xpInLevel = xp - currentLevel.xpRequired;
  const xpForNext = nextLevel ? nextLevel.xpRequired - currentLevel.xpRequired : 1000;

  return (
    <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-40">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{currentLevel.icon}</span>
          <div>
            <p className="text-xs font-bold text-gray-800">{currentLevel.name}</p>
            <div className="w-20">
              <ProgressBar value={xpInLevel} max={xpForNext} height="h-1.5" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Flame size={18} className="text-orange-500" />
            <span className="text-sm font-bold text-orange-500">{streak}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap size={18} className="text-amber-500" />
            <span className="text-sm font-bold text-amber-500">{xp}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SCREENS ───────────────────────────────────────────────────────────────

function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);

  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-amber-900 flex flex-col items-center justify-center px-6 text-center">
        <div className="text-7xl mb-6">🎭</div>
        <h1 className="text-4xl font-black text-white mb-2">Castigat</h1>
        <p className="text-red-200 text-lg mb-1">L'école de théâtre dans votre poche</p>
        <p className="text-red-300/70 text-sm mb-10 italic">par la Compagnie Castigat — Paris</p>
        <div className="space-y-4 w-full max-w-xs">
          <button onClick={() => setStep(1)}
            className="w-full py-4 bg-white text-red-900 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95">
            Commencer l'aventure
          </button>
          <p className="text-red-200/60 text-xs">
            Apprenez le théâtre à votre rythme, de chez vous, avec un vrai suivi humain.
          </p>
        </div>
        <div className="mt-12 flex gap-8 text-red-200/50 text-xs">
          <span className="flex items-center gap-1"><Clock size={14} /> À votre rythme</span>
          <span className="flex items-center gap-1"><MapPin size={14} /> Où vous voulez</span>
          <span className="flex items-center gap-1"><Users size={14} /> Vrai coaching</span>
        </div>
      </div>
    );
  }

  if (step <= QUIZ_QUESTIONS.length) {
    const q = QUIZ_QUESTIONS[step - 1];
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col px-6 py-8">
        <div className="mb-8">
          <p className="text-sm text-gray-400 mb-2">Question {step}/{QUIZ_QUESTIONS.length}</p>
          <ProgressBar value={step} max={QUIZ_QUESTIONS.length} color="bg-red-500" height="h-2" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-8">{q.question}</h2>
        <div className="space-y-3 flex-1">
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => {
              const newAnswers = [...answers, q.scores[i]];
              setAnswers(newAnswers);
              setStep(step + 1);
            }}
              className="w-full p-4 bg-white rounded-xl border-2 border-gray-200 text-left font-medium text-gray-700 hover:border-red-400 hover:bg-red-50 transition-all active:scale-98">
              <span className="text-gray-400 mr-3">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Results
  const totalScore = answers.reduce((a, b) => a + b, 0);
  const maxScore = QUIZ_QUESTIONS.length * 3;
  const pct = totalScore / maxScore;
  const suggestedLevel = pct < 0.25 ? 0 : pct < 0.5 ? 1 : pct < 0.75 ? 2 : 3;
  const level = LEVELS[suggestedLevel];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 text-center">
      <div className="text-6xl mb-4">{level.icon}</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Votre niveau estimé</h2>
      <div className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${level.color} text-white font-bold text-xl mb-4`}>
        {level.name}
      </div>
      <p className="text-gray-500 mb-8 max-w-sm">
        Pas d'inquiétude, vous pourrez toujours accéder aux exercices des niveaux précédents et progresser à votre rythme !
      </p>
      <button onClick={() => onComplete(suggestedLevel)}
        className="px-8 py-4 bg-red-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95">
        C'est parti ! 🎭
      </button>
    </div>
  );
}

function HomeScreen({ state, setState, setCurrentTab, setActiveModule }) {
  const currentLevel = LEVELS.filter(l => state.xp >= l.xpRequired).pop();
  const nextLevel = LEVELS[LEVELS.indexOf(currentLevel) + 1];
  const xpInLevel = state.xp - currentLevel.xpRequired;
  const xpForNext = nextLevel ? nextLevel.xpRequired - currentLevel.xpRequired : 1000;

  const recentBadges = BADGES.filter(b => b.condition(state)).slice(-3);

  const nextPractice = PRACTICE_MODULES[currentLevel.id]?.find(m => !state.completedExercises.includes(m.id));
  const nextCulture = CULTURE_MODULES[currentLevel.id]?.find(m => !state.completedCulture.includes(m.id));

  return (
    <div className="pb-24 pt-20 px-4 max-w-lg mx-auto">
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bonjour ! 🎭</h1>
        <p className="text-gray-500">Prêt·e pour votre entraînement ?</p>
      </div>

      {/* Streak Card */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-5 mb-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame size={24} />
            <span className="font-bold text-lg">{state.streak} jour{state.streak > 1 ? "s" : ""} de suite !</span>
          </div>
          <div className="bg-white/20 rounded-full px-3 py-1 text-sm font-medium">
            {state.xp} XP
          </div>
        </div>
        <ProgressBar value={xpInLevel} max={xpForNext} color="bg-white" height="h-2" />
        <p className="text-xs text-white/70 mt-2">
          {nextLevel ? `${xpForNext - xpInLevel} XP pour atteindre ${nextLevel.name}` : "Niveau maximum atteint !"}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {nextPractice && (
          <button onClick={() => { setActiveModule({ ...nextPractice, section: "practice" }); setCurrentTab("practice"); }}
            className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all text-left">
            <div className="text-2xl mb-2">{nextPractice.icon}</div>
            <p className="font-bold text-sm text-gray-900 mb-1">Prochain exercice</p>
            <p className="text-xs text-gray-500">{nextPractice.title}</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-amber-600 font-medium">
              <Zap size={12} /> +{nextPractice.xp} XP
            </div>
          </button>
        )}
        {nextCulture && (
          <button onClick={() => { setActiveModule({ ...nextCulture, section: "culture" }); setCurrentTab("culture"); }}
            className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all text-left">
            <div className="text-2xl mb-2">{nextCulture.icon}</div>
            <p className="font-bold text-sm text-gray-900 mb-1">Prochaine leçon</p>
            <p className="text-xs text-gray-500">{nextCulture.title}</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-amber-600 font-medium">
              <Zap size={12} /> +{nextCulture.xp} XP
            </div>
          </button>
        )}
      </div>

      {/* Level Path */}
      <div className="mb-6">
        <h2 className="font-bold text-gray-900 mb-4">Votre parcours</h2>
        <div className="space-y-3">
          {LEVELS.map((level, i) => {
            const unlocked = state.xp >= level.xpRequired;
            const isCurrent = level.id === currentLevel.id;
            const practiceCount = PRACTICE_MODULES[level.id]?.length || 0;
            const cultureCount = CULTURE_MODULES[level.id]?.length || 0;
            const completedP = PRACTICE_MODULES[level.id]?.filter(m => state.completedExercises.includes(m.id)).length || 0;
            const completedC = CULTURE_MODULES[level.id]?.filter(m => state.completedCulture.includes(m.id)).length || 0;
            const total = practiceCount + cultureCount;
            const done = completedP + completedC;

            return (
              <div key={level.id}
                className={`rounded-xl p-4 border-2 transition-all ${isCurrent ? "border-red-400 bg-red-50" : unlocked ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50 opacity-60"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{unlocked ? level.icon : "🔒"}</span>
                    <div>
                      <p className={`font-bold ${isCurrent ? "text-red-700" : "text-gray-900"}`}>{level.name}</p>
                      <p className="text-xs text-gray-500">{total} activités · {done}/{total} terminées</p>
                    </div>
                  </div>
                  {unlocked && <ProgressBar value={done} max={total || 1} color={isCurrent ? "bg-red-500" : "bg-gray-400"} height="h-1.5" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Badges */}
      {recentBadges.length > 0 && (
        <div className="mb-6">
          <h2 className="font-bold text-gray-900 mb-3">Derniers badges obtenus</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {recentBadges.map(b => (
              <div key={b.id} className="flex-shrink-0 bg-amber-50 rounded-xl p-3 text-center border border-amber-200 w-24">
                <div className="text-3xl mb-1">{b.icon}</div>
                <p className="text-xs font-bold text-amber-800">{b.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Freemium Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-5 text-white">
        <div className="flex items-start gap-3">
          <Crown size={28} className="flex-shrink-0 mt-1" />
          <div>
            <p className="font-bold text-lg mb-1">Passez à Premium</p>
            <p className="text-sm text-purple-200 mb-3">
              Débloquez le feedback personnalisé d'un vrai metteur en scène, les niveaux avancés et les monologues commentés.
            </p>
            <button className="bg-white text-purple-700 px-5 py-2 rounded-full font-bold text-sm hover:bg-purple-50 transition-all">
              Découvrir l'offre
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PracticeScreen({ state, setState, activeModule, setActiveModule }) {
  const currentLevel = LEVELS.filter(l => state.xp >= l.xpRequired).pop();

  if (activeModule && activeModule.section === "practice") {
    return <ModuleView module={activeModule} state={state} setState={setState} onBack={() => setActiveModule(null)} type="practice" />;
  }

  return (
    <div className="pb-24 pt-20 px-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Pratique</h1>
      <p className="text-gray-500 mb-6">Exercices progressifs pour développer votre jeu</p>

      {LEVELS.map((level) => {
        const unlocked = state.xp >= level.xpRequired;
        const modules = PRACTICE_MODULES[level.id] || [];
        if (modules.length === 0) return null;

        return (
          <div key={level.id} className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{level.icon}</span>
              <h2 className="font-bold text-gray-800">{level.name}</h2>
              {!unlocked && <Lock size={16} className="text-gray-400" />}
            </div>
            <div className="space-y-2">
              {modules.map((mod) => {
                const completed = state.completedExercises.includes(mod.id);
                const locked = !unlocked;
                return (
                  <button key={mod.id} disabled={locked}
                    onClick={() => setActiveModule({ ...mod, section: "practice" })}
                    className={`w-full p-4 rounded-xl border text-left flex items-center gap-4 transition-all ${locked ? "bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed" : completed ? "bg-emerald-50 border-emerald-200" : "bg-white border-gray-200 hover:border-red-300 hover:shadow-sm"}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${completed ? "bg-emerald-100" : "bg-gray-100"}`}>
                      {locked ? "🔒" : mod.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-gray-900 truncate">{mod.title}</p>
                        {mod.premium && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">Premium</span>}
                      </div>
                      <p className="text-xs text-gray-500">{mod.category} · {mod.duration}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {completed && <CheckCircle size={20} className="text-emerald-500" />}
                      <span className="text-xs font-bold text-amber-600">+{mod.xp}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CultureScreen({ state, setState, activeModule, setActiveModule }) {
  const currentLevel = LEVELS.filter(l => state.xp >= l.xpRequired).pop();

  if (activeModule && activeModule.section === "culture") {
    return <CultureModuleView module={activeModule} state={state} setState={setState} onBack={() => setActiveModule(null)} />;
  }

  return (
    <div className="pb-24 pt-20 px-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Culture théâtrale</h1>
      <p className="text-gray-500 mb-6">Histoire, auteurs, techniques et courants</p>

      {LEVELS.map((level) => {
        const unlocked = state.xp >= level.xpRequired;
        const modules = CULTURE_MODULES[level.id] || [];
        if (modules.length === 0) return null;

        return (
          <div key={level.id} className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{level.icon}</span>
              <h2 className="font-bold text-gray-800">{level.name}</h2>
              {!unlocked && <Lock size={16} className="text-gray-400" />}
            </div>
            <div className="space-y-2">
              {modules.map((mod) => {
                const completed = state.completedCulture.includes(mod.id);
                const locked = !unlocked;
                return (
                  <button key={mod.id} disabled={locked}
                    onClick={() => setActiveModule({ ...mod, section: "culture" })}
                    className={`w-full p-4 rounded-xl border text-left flex items-center gap-4 transition-all ${locked ? "bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed" : completed ? "bg-emerald-50 border-emerald-200" : "bg-white border-gray-200 hover:border-red-300 hover:shadow-sm"}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${completed ? "bg-emerald-100" : "bg-gray-100"}`}>
                      {locked ? "🔒" : mod.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-gray-900 truncate">{mod.title}</p>
                      <p className="text-xs text-gray-500">{mod.category} · {mod.duration}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {completed && <CheckCircle size={20} className="text-emerald-500" />}
                      <span className="text-xs font-bold text-amber-600">+{mod.xp}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ModuleView({ module, state, setState, onBack, type }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(state.completedExercises.includes(module.id));
  const [showXP, setShowXP] = useState(false);
  const [videoSubmitted, setVideoSubmitted] = useState(false);

  const isVideo = module.type === "video";
  const steps = isVideo ? module.instructions : module.steps;

  const handleComplete = () => {
    if (!completed) {
      setCompleted(true);
      setShowXP(true);
      setState(prev => ({
        ...prev,
        xp: prev.xp + module.xp,
        completedExercises: [...prev.completedExercises, module.id],
      }));
    }
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto min-h-screen bg-gray-50">
      {showXP && <XPBurst amount={module.xp} onDone={() => setShowXP(false)} />}

      {/* Header */}
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 mb-6 hover:text-gray-700">
        <ChevronLeft size={20} /> Retour
      </button>

      <div className="text-center mb-6">
        <div className="text-4xl mb-2">{module.icon}</div>
        <h1 className="text-xl font-bold text-gray-900">{module.title}</h1>
        <p className="text-sm text-gray-500">{module.category} · {module.duration} · +{module.xp} XP</p>
      </div>

      {/* Video module text */}
      {isVideo && module.text && (
        <div className="bg-white rounded-xl p-5 mb-6 border border-gray-200">
          <p className="text-sm font-medium text-gray-400 mb-2">TEXTE</p>
          <p className="text-gray-800 italic leading-relaxed">{module.text}</p>
          <p className="text-xs text-gray-500 mt-3">— {module.author}</p>
        </div>
      )}

      {/* Steps */}
      <div className="mb-6">
        <ProgressBar value={currentStep + 1} max={steps.length} color="bg-red-500" height="h-1.5" />
        <p className="text-xs text-gray-400 mt-1 text-right">Étape {currentStep + 1}/{steps.length}</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6 min-h-[180px] flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">
              {currentStep + 1}
            </div>
            <p className="text-xs font-medium text-gray-400 uppercase">Étape {currentStep + 1}</p>
          </div>
          <p className="text-gray-800 leading-relaxed">{steps[currentStep]}</p>
        </div>

        <div className="flex justify-between mt-6">
          <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}
            className="px-4 py-2 rounded-xl text-sm font-medium text-gray-500 bg-gray-100 disabled:opacity-30 hover:bg-gray-200 transition-all">
            <ChevronLeft size={16} className="inline" /> Précédent
          </button>
          {currentStep < steps.length - 1 ? (
            <button onClick={() => setCurrentStep(currentStep + 1)}
              className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-all">
              Suivant <ChevronRight size={16} className="inline" />
            </button>
          ) : (
            !isVideo ? (
              <button onClick={handleComplete} disabled={completed}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${completed ? "bg-emerald-100 text-emerald-700" : "bg-emerald-500 text-white hover:bg-emerald-600"}`}>
                {completed ? "✓ Terminé" : "Valider ✓"}
              </button>
            ) : null
          )}
        </div>
      </div>

      {/* Video submission */}
      {isVideo && currentStep === steps.length - 1 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
          {module.premium && !videoSubmitted ? (
            <div className="text-center">
              <Crown size={32} className="text-purple-500 mx-auto mb-3" />
              <p className="font-bold text-gray-900 mb-2">Fonctionnalité Premium</p>
              <p className="text-sm text-gray-500 mb-4">Envoyez votre vidéo et recevez un retour personnalisé d'un metteur en scène professionnel sous 48h.</p>
              <button onClick={() => { setVideoSubmitted(true); setState(prev => ({ ...prev, videosSubmitted: prev.videosSubmitted + 1 })); handleComplete(); }}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2">
                <Upload size={18} /> Envoyer ma vidéo (Premium)
              </button>
            </div>
          ) : videoSubmitted ? (
            <div className="text-center">
              <CheckCircle size={32} className="text-emerald-500 mx-auto mb-2" />
              <p className="font-bold text-emerald-700">Vidéo envoyée !</p>
              <p className="text-sm text-gray-500">Un coach vous répondra sous 48h.</p>
            </div>
          ) : (
            <div className="text-center">
              <Camera size={32} className="text-red-500 mx-auto mb-3" />
              <p className="font-bold text-gray-900 mb-2">Filmez-vous !</p>
              <p className="text-sm text-gray-500 mb-4">Envoyez votre monologue pour un retour personnalisé.</p>
              <button onClick={() => { setVideoSubmitted(true); setState(prev => ({ ...prev, videosSubmitted: prev.videosSubmitted + 1 })); handleComplete(); }}
                className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2">
                <Upload size={18} /> Envoyer ma vidéo
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tip */}
      {module.tip && (
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
          <div className="flex items-start gap-2">
            <Info size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-700 mb-1">LE SAVIEZ-VOUS ?</p>
              <p className="text-sm text-amber-800">{module.tip}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CultureModuleView({ module, state, setState, onBack }) {
  const [phase, setPhase] = useState("lesson"); // lesson | quiz | result
  const [contentIndex, setContentIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showXP, setShowXP] = useState(false);

  const handleQuizAnswer = (idx) => {
    setSelectedAnswer(idx);
    setTimeout(() => {
      const correct = idx === module.quiz[quizIndex].correct;
      const newScore = correct ? quizScore + 1 : quizScore;
      setQuizScore(newScore);
      setSelectedAnswer(null);

      if (quizIndex < module.quiz.length - 1) {
        setQuizIndex(quizIndex + 1);
      } else {
        setPhase("result");
        const isPerfect = newScore === module.quiz.length;
        if (!state.completedCulture.includes(module.id)) {
          setShowXP(true);
          setState(prev => ({
            ...prev,
            xp: prev.xp + module.xp,
            completedCulture: [...prev.completedCulture, module.id],
            perfectQuizzes: prev.perfectQuizzes + (isPerfect ? 1 : 0),
          }));
        }
      }
    }, 1000);
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto min-h-screen bg-gray-50">
      {showXP && <XPBurst amount={module.xp} onDone={() => setShowXP(false)} />}

      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 mb-6 hover:text-gray-700">
        <ChevronLeft size={20} /> Retour
      </button>

      <div className="text-center mb-6">
        <div className="text-4xl mb-2">{module.icon}</div>
        <h1 className="text-xl font-bold text-gray-900">{module.title}</h1>
        <p className="text-sm text-gray-500">{module.category} · {module.duration}</p>
      </div>

      {phase === "lesson" && (
        <>
          <div className="mb-4">
            <ProgressBar value={contentIndex + 1} max={module.content.length} color="bg-blue-500" height="h-1.5" />
            <p className="text-xs text-gray-400 mt-1 text-right">{contentIndex + 1}/{module.content.length}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6 min-h-[200px] flex flex-col justify-between">
            <p className="text-gray-800 leading-relaxed text-lg">{module.content[contentIndex].value}</p>
            <div className="flex justify-between mt-6">
              <button onClick={() => setContentIndex(Math.max(0, contentIndex - 1))} disabled={contentIndex === 0}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-500 bg-gray-100 disabled:opacity-30 hover:bg-gray-200">
                <ChevronLeft size={16} className="inline" /> Précédent
              </button>
              {contentIndex < module.content.length - 1 ? (
                <button onClick={() => setContentIndex(contentIndex + 1)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                  Suivant <ChevronRight size={16} className="inline" />
                </button>
              ) : (
                <button onClick={() => setPhase("quiz")}
                  className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-amber-500 hover:bg-amber-600">
                  Quiz ! 🧠
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {phase === "quiz" && (
        <>
          <div className="mb-4">
            <ProgressBar value={quizIndex + 1} max={module.quiz.length} color="bg-amber-500" height="h-1.5" />
            <p className="text-xs text-gray-400 mt-1 text-right">Question {quizIndex + 1}/{module.quiz.length}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{module.quiz[quizIndex].q}</h2>
            <div className="space-y-2">
              {module.quiz[quizIndex].options.map((opt, i) => {
                const isCorrect = i === module.quiz[quizIndex].correct;
                const isSelected = selectedAnswer === i;
                let style = "bg-white border-gray-200 hover:border-blue-400";
                if (selectedAnswer !== null) {
                  if (isCorrect) style = "bg-emerald-50 border-emerald-400";
                  else if (isSelected) style = "bg-red-50 border-red-400";
                }
                return (
                  <button key={i} onClick={() => selectedAnswer === null && handleQuizAnswer(i)}
                    className={`w-full p-3 rounded-xl border-2 text-left font-medium text-sm transition-all ${style}`}>
                    <span className="text-gray-400 mr-2">{String.fromCharCode(65 + i)}.</span>
                    {opt}
                    {selectedAnswer !== null && isCorrect && <CheckCircle size={16} className="inline ml-2 text-emerald-500" />}
                    {selectedAnswer !== null && isSelected && !isCorrect && <X size={16} className="inline ml-2 text-red-500" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {phase === "result" && (
        <div className="text-center">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <div className="text-5xl mb-4">{quizScore === module.quiz.length ? "🏆" : quizScore > 0 ? "👏" : "💪"}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {quizScore === module.quiz.length ? "Parfait !" : quizScore > 0 ? "Bien joué !" : "On recommence ?"}
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              {quizScore}/{module.quiz.length} bonnes réponses
            </p>
            <div className="flex items-center justify-center gap-1 text-amber-600 font-bold mb-6">
              <Zap size={20} /> +{module.xp} XP gagnés
            </div>
            <button onClick={onBack}
              className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all">
              Continuer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileScreen({ state, setState }) {
  const currentLevel = LEVELS.filter(l => state.xp >= l.xpRequired).pop();
  const totalExercises = Object.values(PRACTICE_MODULES).flat().length;
  const totalCulture = Object.values(CULTURE_MODULES).flat().length;

  return (
    <div className="pb-24 pt-20 px-4 max-w-lg mx-auto">
      {/* Profile Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-amber-500 mx-auto mb-3 flex items-center justify-center text-3xl shadow-lg">
          🎭
        </div>
        <h1 className="text-xl font-bold text-gray-900">Apprenti·e Comédien·ne</h1>
        <div className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${currentLevel.color} text-white font-bold text-sm mt-2`}>
          {currentLevel.icon} {currentLevel.name}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
          <Zap size={20} className="text-amber-500 mx-auto mb-1" />
          <p className="text-xl font-black text-gray-900">{state.xp}</p>
          <p className="text-xs text-gray-500">XP total</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
          <Flame size={20} className="text-orange-500 mx-auto mb-1" />
          <p className="text-xl font-black text-gray-900">{state.streak}</p>
          <p className="text-xs text-gray-500">Jours de suite</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
          <Trophy size={20} className="text-purple-500 mx-auto mb-1" />
          <p className="text-xl font-black text-gray-900">{BADGES.filter(b => b.condition(state)).length}</p>
          <p className="text-xs text-gray-500">Badges</p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm mb-6">
        <h2 className="font-bold text-gray-900 mb-4">Progression</h2>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Exercices pratiques</span>
              <span className="font-bold text-gray-900">{state.completedExercises.length}/{totalExercises}</span>
            </div>
            <ProgressBar value={state.completedExercises.length} max={totalExercises} color="bg-red-500" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Leçons de culture</span>
              <span className="font-bold text-gray-900">{state.completedCulture.length}/{totalCulture}</span>
            </div>
            <ProgressBar value={state.completedCulture.length} max={totalCulture} color="bg-blue-500" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Vidéos soumises</span>
              <span className="font-bold text-gray-900">{state.videosSubmitted}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="mb-6">
        <h2 className="font-bold text-gray-900 mb-4">Badges</h2>
        <div className="grid grid-cols-2 gap-3">
          {BADGES.map(b => {
            const earned = b.condition(state);
            return (
              <div key={b.id} className={`rounded-xl p-4 border text-center transition-all ${earned ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray-100 opacity-50"}`}>
                <div className="text-3xl mb-2">{earned ? b.icon : "🔒"}</div>
                <p className="text-sm font-bold text-gray-800">{b.name}</p>
                <p className="text-xs text-gray-500 mt-1">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset */}
      <button onClick={() => {
        if (confirm("Réinitialiser toute votre progression ?")) {
          setState({
            xp: 0, streak: 1, completedExercises: [], completedCulture: [],
            perfectQuizzes: 0, videosSubmitted: 0, level: 0, onboarded: false,
          });
        }
      }}
        className="w-full py-3 text-sm text-red-500 font-medium hover:bg-red-50 rounded-xl transition-all flex items-center justify-center gap-2">
        <RotateCcw size={16} /> Réinitialiser la progression
      </button>
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────

const INITIAL_STATE = {
  xp: 0,
  streak: 1,
  completedExercises: [],
  completedCulture: [],
  perfectQuizzes: 0,
  videosSubmitted: 0,
  level: 0,
  onboarded: false,
};

export default function CastigatApp() {
  const [state, setState] = useState(INITIAL_STATE);
  const [currentTab, setCurrentTab] = useState("home");
  const [activeModule, setActiveModule] = useState(null);

  const handleOnboardingComplete = (suggestedLevel) => {
    const xpForLevel = LEVELS[suggestedLevel]?.xpRequired || 0;
    setState(prev => ({ ...prev, onboarded: true, xp: xpForLevel, level: suggestedLevel }));
  };

  if (!state.onboarded) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar xp={state.xp} streak={state.streak} />

      {currentTab === "home" && (
        <HomeScreen state={state} setState={setState} setCurrentTab={setCurrentTab} setActiveModule={setActiveModule} />
      )}
      {currentTab === "practice" && (
        <PracticeScreen state={state} setState={setState} activeModule={activeModule} setActiveModule={setActiveModule} />
      )}
      {currentTab === "culture" && (
        <CultureScreen state={state} setState={setState} activeModule={activeModule} setActiveModule={setActiveModule} />
      )}
      {currentTab === "profile" && (
        <ProfileScreen state={state} setState={setState} />
      )}

      <NavBar currentTab={currentTab} setCurrentTab={setCurrentTab} xp={state.xp} streak={state.streak} />
    </div>
  );
}