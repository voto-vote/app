import type {
  AdminUser,
  AdminElection,
  AdminThesis,
  AdminParty,
  AdminCandidate,
  ElectionGroup,
  Invitation,
  EmailTemplate,
  ChangeRequest,
  PremadeThesis,
  PremadePartyTemplate,
} from "@/types/admin";

// ============================================
// MOCK USERS
// ============================================

export const mockUsers: AdminUser[] = [
  {
    id: 1,
    email: "superadmin@voto.vote",
    firstName: "Super",
    lastName: "Admin",
    role: "superadmin",
    profilePicture: "/avatars/admin.png",
    agreedToTerms: true,
    agreedToTermsDate: "2024-01-15T10:00:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    lastLoginAt: "2025-02-06T12:00:00Z",
    permissions: { elections: [], parties: [] },
  },
  {
    id: 2,
    email: "election.admin@voto.vote",
    firstName: "Election",
    lastName: "Manager",
    role: "electionadmin",
    agreedToTerms: true,
    agreedToTermsDate: "2024-02-01T10:00:00Z",
    createdAt: "2024-02-01T00:00:00Z",
    lastLoginAt: "2025-02-05T14:30:00Z",
    permissions: { elections: [1, 2, 3], parties: [] },
  },
  {
    id: 3,
    email: "cdu@example.com",
    firstName: "Christian",
    lastName: "Demokrat",
    role: "partyadmin",
    agreedToTerms: true,
    agreedToTermsDate: "2024-03-01T10:00:00Z",
    createdAt: "2024-03-01T00:00:00Z",
    permissions: { elections: [], parties: [1] },
  },
  {
    id: 4,
    email: "kandidat@example.com",
    firstName: "Max",
    lastName: "Mustermann",
    role: "candidate",
    agreedToTerms: false,
    createdAt: "2024-04-01T00:00:00Z",
    permissions: { elections: [], parties: [], candidateId: 1 },
  },
];

// ============================================
// MOCK ELECTION GROUPS
// ============================================

export const mockElectionGroups: ElectionGroup[] = [
  {
    id: 1,
    name: "Kirchenwahl 2025",
    electionDate: "2025-06-15",
    elections: [
      {
        id: 1,
        name: "Kirchenwahl Ulm, Göppingen",
        location: "Ulm, Göppingen",
        stage: "thesis-entry",
        electionDate: "2025-06-15",
      },
      {
        id: 2,
        name: "Kirchenwahl Biberach, Ravensburg",
        location: "Biberach, Ravensburg",
        stage: "thesis-entry",
        electionDate: "2025-06-15",
      },
      {
        id: 3,
        name: "Kirchenwahl Hohenlohe-Weinsberg",
        location: "Hohenlohe-Weinsberg",
        stage: "created",
        electionDate: "2025-06-15",
      },
    ],
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-15T00:00:00Z",
    createdBy: 1,
  },
  {
    id: 2,
    name: "Kommunalwahl 2025",
    electionDate: "2025-09-20",
    elections: [
      {
        id: 4,
        name: "Gemeinderat Stuttgart",
        location: "Stuttgart",
        stage: "answering",
        electionDate: "2025-09-20",
      },
    ],
    createdAt: "2025-01-10T00:00:00Z",
    updatedAt: "2025-01-20T00:00:00Z",
    createdBy: 1,
  },
];

// ============================================
// MOCK ELECTIONS
// ============================================

export const mockElections: AdminElection[] = [
  {
    id: 1,
    groupId: 1,
    name: "Kirchenwahl Ulm, Göppingen",
    title: "Kirchenwahl 2025",
    subtitle: "Ulm und Göppingen",
    description:
      "Wählen Sie Ihre Vertreter für die Kirchenleitung in den Bezirken Ulm und Göppingen.",
    electionDate: "2025-06-15",
    electionType: "candidates-and-parties",
    stage: "thesis-entry",
    locationType: "city",
    location: "Ulm, Göppingen",
    supportedLocales: ["de", "en"],
    defaultLocale: "de",
    launchDate: "2025-06-01T00:00:00Z",
    sundownDate: "2025-06-30T23:59:59Z",
    settings: {
      faq: [
        {
          id: "faq1",
          question: "Wer kann wählen?",
          answer: "Alle Kirchenmitglieder ab 16 Jahren.",
          order: 1,
        },
        {
          id: "faq2",
          question: "Wie viele Stimmen habe ich?",
          answer: "Sie haben eine Stimme pro Wahlkreis.",
          order: 2,
        },
      ],
      survey: {
        before: {
          enabled: true,
          endpoint: "https://survey.example.com/pre",
          displayType: "link",
          frequency: 1,
          title: "Kurze Umfrage",
          description: "Helfen Sie uns, den Wahlhelfer zu verbessern.",
          buttonYes: "Zur Umfrage",
          buttonNo: "Nein, danke",
        },
        after: {
          enabled: true,
          endpoint: "https://survey.example.com/post",
          displayType: "embedded",
          frequency: 1,
          title: "Feedback",
          description: "Wie war Ihre Erfahrung?",
          buttonYes: "Feedback geben",
          buttonNo: "Überspringen",
        },
      },
      callToAction: {
        enabled: true,
        title: "Jetzt informieren!",
        description: "Erfahren Sie mehr über die Kandidaten vor Ort.",
        buttonText: "Mehr erfahren",
        buttonUrl: "https://kirche.de/wahl",
      },
      thesisOrder: "random",
      requireTranslationApproval: true,
      theming: {
        logo: "/logos/kirche.svg",
        primaryColor: "oklch(44.7038% 0.24 331.12)",
        backgroundImage: "/backgrounds/kirche.jpg",
      },
      algorithm: {
        decisions: 5,
        matchType: "candidates-and-parties",
        weightedVotesLimit: 4,
        matrix: [
          [0, 25, 50, 75, 100],
          [25, 0, 25, 50, 75],
          [50, 25, 0, 25, 50],
          [75, 50, 25, 0, 25],
          [100, 75, 50, 25, 0],
        ],
        liveMatchesVisible: true,
      },
      matchFields: [
        { type: "district", value: "Wahlkreis", required: true, show: true },
        {
          type: "description",
          value: "Beschreibung",
          required: false,
          show: true,
        },
      ],
    },
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-15T00:00:00Z",
    createdBy: 1,
  },
  {
    id: 5,
    name: "Bürgermeisterwahl Tübingen",
    title: "Bürgermeisterwahl 2025",
    subtitle: "Stadt Tübingen",
    description:
      "Wählen Sie den neuen Bürgermeister oder die neue Bürgermeisterin für Tübingen.",
    electionDate: "2025-10-12",
    electionType: "candidates",
    stage: "live",
    locationType: "city",
    location: "Tübingen",
    supportedLocales: ["de"],
    defaultLocale: "de",
    launchDate: "2025-10-01T00:00:00Z",
    sundownDate: "2025-10-12T20:00:00Z",
    settings: {
      faq: [],
      survey: {},
      thesisOrder: "configured",
      requireTranslationApproval: false,
      theming: {
        primaryColor: "oklch(50% 0.2 240)",
      },
      algorithm: {
        decisions: 3,
        matchType: "candidates",
        weightedVotesLimit: false,
        matrix: [
          [0, 50, 100],
          [50, 0, 50],
          [100, 50, 0],
        ],
        liveMatchesVisible: false,
      },
      matchFields: [],
    },
    createdAt: "2025-03-01T00:00:00Z",
    updatedAt: "2025-09-15T00:00:00Z",
    createdBy: 2,
  },
];

// ============================================
// MOCK THESES
// ============================================

export const mockTheses: AdminThesis[] = [
  {
    id: "thesis-1",
    electionId: 1,
    order: 1,
    category: "Umwelt",
    translations: [
      {
        id: "trans-1-de",
        languageCode: "de",
        title: "Fahrradwege",
        text: "Die Gemeinde sollte mehr Fahrradwege bauen.",
        approvalStatus: "approved",
        isAutoTranslated: false,
      },
      {
        id: "trans-1-en",
        languageCode: "en",
        title: "Bike Lanes",
        text: "The municipality should build more bike lanes.",
        approvalStatus: "pending",
        isAutoTranslated: true,
      },
    ],
    explanations: [],
    isLocked: false,
    createdAt: "2025-01-10T00:00:00Z",
    updatedAt: "2025-01-10T00:00:00Z",
  },
  {
    id: "thesis-2",
    electionId: 1,
    order: 2,
    category: "Soziales",
    translations: [
      {
        id: "trans-2-de",
        languageCode: "de",
        title: "Kindergartenplätze",
        text: "Es sollten mehr Kindergartenplätze geschaffen werden.",
        approvalStatus: "approved",
        isAutoTranslated: false,
      },
    ],
    explanations: [
      {
        id: "expl-2-1",
        startOffset: 10,
        endOffset: 30,
        text: "Dies bezieht sich auf öffentlich geförderte Kindergärten.",
      },
    ],
    isLocked: false,
    createdAt: "2025-01-11T00:00:00Z",
    updatedAt: "2025-01-11T00:00:00Z",
  },
  {
    id: "thesis-3",
    electionId: 1,
    order: 3,
    category: "Wirtschaft",
    translations: [
      {
        id: "trans-3-de",
        languageCode: "de",
        title: "Gewerbesteuer",
        text: "Die Gewerbesteuer sollte gesenkt werden, um lokale Unternehmen zu fördern.",
        approvalStatus: "approved",
        isAutoTranslated: false,
      },
    ],
    explanations: [],
    isLocked: false,
    createdAt: "2025-01-12T00:00:00Z",
    updatedAt: "2025-01-12T00:00:00Z",
  },
];

// ============================================
// MOCK PREMADE THESES POOL
// ============================================

export const mockPremadeThesesPool: PremadeThesis[] = [
  {
    id: "pool-1",
    category: "Umwelt",
    originalLocale: "de",
    translations: [
      {
        id: "pool-1-de",
        languageCode: "de",
        title: "Erneuerbare Energien",
        text: "Die Gemeinde sollte verstärkt auf erneuerbare Energien setzen.",
        approvalStatus: "approved",
        isAutoTranslated: false,
      },
    ],
    usageCount: 45,
    shareable: true,
    authorInstanceId: 0,
  },
  {
    id: "pool-2",
    category: "Bildung",
    originalLocale: "de",
    translations: [
      {
        id: "pool-2-de",
        languageCode: "de",
        title: "Digitale Bildung",
        text: "Schulen sollten besser mit digitaler Infrastruktur ausgestattet werden.",
        approvalStatus: "approved",
        isAutoTranslated: false,
      },
    ],
    usageCount: 67,
    shareable: true,
    authorInstanceId: 0,
  },
  {
    id: "pool-3",
    category: "Verkehr",
    originalLocale: "de",
    translations: [
      {
        id: "pool-3-de",
        languageCode: "de",
        title: "Öffentlicher Nahverkehr",
        text: "Der öffentliche Nahverkehr sollte ausgebaut und günstiger werden.",
        approvalStatus: "approved",
        isAutoTranslated: false,
      },
    ],
    usageCount: 89,
    shareable: true,
    authorInstanceId: 0,
  },
  {
    id: "pool-4",
    category: "Soziales",
    originalLocale: "de",
    translations: [
      {
        id: "pool-4-de",
        languageCode: "de",
        title: "Bezahlbarer Wohnraum",
        text: "Die Schaffung von bezahlbarem Wohnraum sollte Priorität haben.",
        approvalStatus: "approved",
        isAutoTranslated: false,
      },
    ],
    usageCount: 112,
    shareable: true,
    authorInstanceId: 0,
  },
];

// ============================================
// MOCK PARTIES
// ============================================

export const mockParties: AdminParty[] = [
  {
    id: 1,
    electionId: 1,
    shortName: "CDU",
    detailedName: "Christlich Demokratische Union",
    description: "Christlich-konservative Volkspartei",
    website: "https://cdu.de",
    color: "#000000",
    logo: "/parties/cdu.svg",
    status: "active",
    isPublic: true,
    agents: [
      {
        id: 1,
        userId: 3,
        email: "cdu@example.com",
        firstName: "Christian",
        lastName: "Demokrat",
        invitationStatus: "accepted",
        invitedAt: "2025-01-15T00:00:00Z",
        acceptedAt: "2025-01-16T10:00:00Z",
      },
    ],
    answerProgress: { total: 3, answered: 2, percentage: 67 },
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2025-01-20T00:00:00Z",
  },
  {
    id: 2,
    electionId: 1,
    shortName: "SPD",
    detailedName: "Sozialdemokratische Partei Deutschlands",
    description: "Sozialdemokratische Volkspartei",
    website: "https://spd.de",
    color: "#E3000F",
    logo: "/parties/spd.svg",
    status: "invited",
    isPublic: false,
    agents: [
      {
        id: 2,
        userId: 5,
        email: "spd@example.com",
        firstName: "Sonja",
        lastName: "Demokrat",
        invitationStatus: "sent",
        invitedAt: "2025-01-15T00:00:00Z",
      },
    ],
    answerProgress: { total: 3, answered: 0, percentage: 0 },
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2025-01-15T00:00:00Z",
  },
  {
    id: 3,
    electionId: 1,
    shortName: "Grüne",
    detailedName: "Bündnis 90/Die Grünen",
    description: "Ökologische Partei",
    website: "https://gruene.de",
    color: "#46962B",
    logo: "/parties/gruene.svg",
    status: "voted",
    isPublic: true,
    agents: [
      {
        id: 3,
        userId: 6,
        email: "gruene@example.com",
        firstName: "Gustav",
        lastName: "Grün",
        invitationStatus: "accepted",
        invitedAt: "2025-01-15T00:00:00Z",
        acceptedAt: "2025-01-17T09:00:00Z",
      },
    ],
    answerProgress: { total: 3, answered: 3, percentage: 100 },
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2025-02-01T00:00:00Z",
  },
];

// ============================================
// MOCK PREMADE PARTY TEMPLATES
// ============================================

export const mockPremadePartyTemplates: PremadePartyTemplate[] = [
  {
    id: "tpl-cdu",
    shortName: "CDU",
    detailedName: "Christlich Demokratische Union",
    color: "#000000",
    logo: "/parties/cdu.svg",
    description: "Christlich-konservative Volkspartei",
  },
  {
    id: "tpl-spd",
    shortName: "SPD",
    detailedName: "Sozialdemokratische Partei Deutschlands",
    color: "#E3000F",
    logo: "/parties/spd.svg",
    description: "Sozialdemokratische Volkspartei",
  },
  {
    id: "tpl-gruene",
    shortName: "Grüne",
    detailedName: "Bündnis 90/Die Grünen",
    color: "#46962B",
    logo: "/parties/gruene.svg",
    description: "Ökologische Partei",
  },
  {
    id: "tpl-fdp",
    shortName: "FDP",
    detailedName: "Freie Demokratische Partei",
    color: "#FFED00",
    logo: "/parties/fdp.svg",
    description: "Liberale Partei",
  },
  {
    id: "tpl-linke",
    shortName: "Die Linke",
    detailedName: "Die Linke",
    color: "#BE3075",
    logo: "/parties/linke.svg",
    description: "Linke Partei",
  },
  {
    id: "tpl-afd",
    shortName: "AfD",
    detailedName: "Alternative für Deutschland",
    color: "#009EE0",
    logo: "/parties/afd.svg",
    description: "Rechtspopulistische Partei",
  },
];

// ============================================
// MOCK CANDIDATES
// ============================================

export const mockCandidates: AdminCandidate[] = [
  {
    id: 1,
    electionId: 1,
    userId: 4,
    partyId: 1,
    partyName: "CDU",
    firstName: "Max",
    lastName: "Mustermann",
    title: "Dr.",
    email: "max.mustermann@example.com",
    gender: "male",
    dateOfBirth: "1980-05-15",
    description:
      "Langjähriges Gemeindemitglied und engagierter Lokalpolitiker.",
    district: "Ulm-Nord",
    listPlace: 1,
    website: "https://max-mustermann.de",
    profilePicture: "/candidates/max.jpg",
    status: "active",
    isPublic: true,
    invitationStatus: "accepted",
    answerProgress: { total: 3, answered: 3, percentage: 100 },
    createdAt: "2025-01-20T00:00:00Z",
    updatedAt: "2025-02-01T00:00:00Z",
  },
  {
    id: 2,
    electionId: 1,
    userId: 7,
    partyId: 2,
    partyName: "SPD",
    firstName: "Maria",
    lastName: "Musterfrau",
    email: "maria.musterfrau@example.com",
    gender: "female",
    dateOfBirth: "1975-08-22",
    description: "Engagierte Sozialarbeiterin mit Herz für die Gemeinde.",
    district: "Ulm-Süd",
    listPlace: 1,
    status: "invited",
    isPublic: false,
    invitationStatus: "sent",
    answerProgress: { total: 3, answered: 0, percentage: 0 },
    createdAt: "2025-01-20T00:00:00Z",
    updatedAt: "2025-01-20T00:00:00Z",
  },
];

// ============================================
// MOCK INVITATIONS
// ============================================

export const mockInvitations: Invitation[] = [
  {
    id: "inv-1",
    type: "party-agent",
    electionId: 1,
    recipientEmail: "cdu@example.com",
    recipientName: "Christian Demokrat",
    targetId: 1,
    templateId: "tpl-party-invite",
    status: "accepted",
    sentAt: "2025-01-15T10:00:00Z",
    expiresAt: "2025-02-15T10:00:00Z",
    acceptedAt: "2025-01-16T10:00:00Z",
    token: "abc123",
  },
  {
    id: "inv-2",
    type: "party-agent",
    electionId: 1,
    recipientEmail: "spd@example.com",
    recipientName: "Sonja Demokrat",
    targetId: 2,
    templateId: "tpl-party-invite",
    status: "sent",
    sentAt: "2025-01-15T10:00:00Z",
    expiresAt: "2025-02-15T10:00:00Z",
    token: "def456",
  },
  {
    id: "inv-3",
    type: "candidate",
    electionId: 1,
    recipientEmail: "max.mustermann@example.com",
    recipientName: "Max Mustermann",
    targetId: 1,
    templateId: "tpl-candidate-invite",
    status: "accepted",
    sentAt: "2025-01-20T10:00:00Z",
    expiresAt: "2025-02-20T10:00:00Z",
    acceptedAt: "2025-01-21T08:00:00Z",
    token: "ghi789",
  },
];

// ============================================
// MOCK EMAIL TEMPLATES
// ============================================

export const mockEmailTemplates: EmailTemplate[] = [
  {
    id: "tpl-party-invite",
    electionId: 1,
    name: "Party Invitation",
    type: "party-agent",
    subject: "Einladung zur Teilnahme an {{electionName}}",
    body: `<p>Sehr geehrte/r {{recipientName}},</p>
<p>Sie wurden eingeladen, als Parteivertreter an der Wahl <strong>{{electionName}}</strong> teilzunehmen.</p>
<p>Bitte klicken Sie auf den folgenden Link, um Ihre Teilnahme zu bestätigen:</p>
<p><a href="{{invitationLink}}">Einladung annehmen</a></p>
<p>Mit freundlichen Grüßen,<br/>Ihr VOTO Team</p>`,
    placeholders: [
      {
        key: "recipientName",
        description: "Name des Empfängers",
        example: "Max Mustermann",
      },
      {
        key: "electionName",
        description: "Name der Wahl",
        example: "Kirchenwahl 2025",
      },
      {
        key: "invitationLink",
        description: "Link zur Einladung",
        example: "https://voto.vote/invite/abc123",
      },
    ],
    isDefault: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "tpl-candidate-invite",
    electionId: 1,
    name: "Candidate Invitation",
    type: "candidate",
    subject: "Einladung als Kandidat/in für {{electionName}}",
    body: `<p>Sehr geehrte/r {{recipientName}},</p>
<p>Sie wurden als Kandidat/in für die Wahl <strong>{{electionName}}</strong> nominiert.</p>
<p>Bitte vervollständigen Sie Ihr Profil und beantworten Sie die Thesen.</p>
<p><a href="{{invitationLink}}">Jetzt starten</a></p>
<p>Die Frist endet am {{deadline}}.</p>
<p>Mit freundlichen Grüßen,<br/>Ihr VOTO Team</p>`,
    placeholders: [
      {
        key: "recipientName",
        description: "Name des Empfängers",
        example: "Max Mustermann",
      },
      {
        key: "electionName",
        description: "Name der Wahl",
        example: "Kirchenwahl 2025",
      },
      {
        key: "invitationLink",
        description: "Link zur Einladung",
        example: "https://voto.vote/invite/abc123",
      },
      {
        key: "deadline",
        description: "Frist für die Beantwortung",
        example: "15. März 2025",
      },
    ],
    isDefault: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "tpl-reminder",
    electionId: 1,
    name: "Reminder",
    type: "party-agent",
    subject: "Erinnerung: Thesen für {{electionName}} beantworten",
    body: `<p>Sehr geehrte/r {{recipientName}},</p>
<p>Wir möchten Sie daran erinnern, dass Sie noch {{pendingCount}} Thesen für die Wahl <strong>{{electionName}}</strong> beantworten müssen.</p>
<p><a href="{{portalLink}}">Jetzt beantworten</a></p>
<p>Die Frist endet am {{deadline}}.</p>
<p>Mit freundlichen Grüßen,<br/>Ihr VOTO Team</p>`,
    placeholders: [
      {
        key: "recipientName",
        description: "Name des Empfängers",
        example: "Max Mustermann",
      },
      {
        key: "electionName",
        description: "Name der Wahl",
        example: "Kirchenwahl 2025",
      },
      {
        key: "pendingCount",
        description: "Anzahl offener Thesen",
        example: "5",
      },
      {
        key: "portalLink",
        description: "Link zum Portal",
        example: "https://voto.vote/portal",
      },
      { key: "deadline", description: "Frist", example: "15. März 2025" },
    ],
    isDefault: false,
    createdAt: "2025-01-05T00:00:00Z",
    updatedAt: "2025-01-05T00:00:00Z",
  },
];

// ============================================
// MOCK CHANGE REQUESTS
// ============================================

export const mockChangeRequests: ChangeRequest[] = [
  {
    id: "cr-1",
    electionId: 1,
    type: "thesis",
    targetId: "thesis-1",
    requestedBy: 2,
    requestedByName: "Election Manager",
    requestedByRole: "electionadmin",
    description: "Korrektur eines Tippfehlers in der These",
    changes: [
      {
        field: "text",
        currentValue: "Die Gemeinde sollte mehr Fahrradwege bauen.",
        requestedValue: "Die Gemeinde sollte mehr sichere Fahrradwege bauen.",
      },
    ],
    status: "pending",
    createdAt: "2025-02-01T00:00:00Z",
  },
  {
    id: "cr-2",
    electionId: 1,
    type: "answer",
    targetId: 1,
    requestedBy: 3,
    requestedByName: "Christian Demokrat",
    requestedByRole: "partyadmin",
    description: "Änderung der Begründung für These 2",
    changes: [
      {
        field: "explanation",
        currentValue: "Wir unterstützen diesen Vorschlag.",
        requestedValue:
          "Wir unterstützen diesen Vorschlag mit Einschränkungen bezüglich der Finanzierung.",
      },
    ],
    status: "approved",
    reviewedBy: 1,
    reviewedAt: "2025-02-02T10:00:00Z",
    reviewNotes: "Änderung genehmigt.",
    createdAt: "2025-02-01T12:00:00Z",
  },
];
