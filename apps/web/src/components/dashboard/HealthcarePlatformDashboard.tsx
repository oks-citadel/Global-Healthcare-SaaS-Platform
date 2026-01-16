import React, { useState } from "react";

const HealthcarePlatformDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const platformOverview = {
    tagline: "One Platform. Complete Healthcare.",
    description:
      "A unified, enterprise-grade healthcare platform connecting patients, providers, and organizations with secure, compliant, and interoperable solutions across the entire care continuum.",
    stats: [
      { label: "Integrated Modules", value: "21", icon: "🧩" },
      { label: "Data Standards", value: "6+", icon: "📋" },
      { label: "Compliance Frameworks", value: "5", icon: "🛡️" },
      { label: "Cloud Regions", value: "Multi", icon: "🌍" },
    ],
    compliance: ["HIPAA", "GDPR", "POPIA", "SOC 2", "HITRUST"],
    standards: ["FHIR R4", "HL7v2", "C-CDA", "DICOM", "X12 EDI", "NCPDP"],
  };

  const categories = [
    {
      id: "clinical",
      name: "Clinical Operations",
      icon: "🏥",
      color: "from-blue-500 to-blue-700",
      bgLight: "bg-blue-50",
      border: "border-blue-200",
      description:
        "Streamline clinical workflows, documentation, and care coordination",
      modules: [
        {
          id: 1,
          name: "AI Clinical Documentation",
          description:
            "Ambient listening that auto-generates clinical notes and suggests billing codes",
          features: [
            "Voice-to-SOAP notes",
            "Auto ICD-10/CPT coding",
            "Provider attestation",
            "Multi-specialty templates",
          ],
          benefits: [
            "50%+ documentation time savings",
            "Reduced physician burnout",
            "Improved coding accuracy",
          ],
          integrations: ["EHR systems", "FHIR R4", "C-CDA"],
          pricing: "Per-provider monthly",
        },
        {
          id: 2,
          name: "Prior Authorization Automation",
          description:
            "AI-driven payer submissions with real-time eligibility verification",
          features: [
            "Real-time eligibility checks",
            "Clinical criteria matching",
            "Auto-submission",
            "Appeal generation",
          ],
          benefits: [
            "40%+ auto-approval rate",
            "Reduced staff burden",
            "Faster determinations",
          ],
          integrations: ["X12 278/275", "Payer APIs", "FHIR CRD/DTR"],
          pricing: "Per-transaction + base",
        },
        {
          id: 3,
          name: "Care Coordination Hub",
          description:
            "Multi-provider care plan management for complex patients",
          features: [
            "Shared care plans",
            "Task assignment",
            "Secure messaging",
            "ADT alerts",
            "SDOH tracking",
          ],
          benefits: [
            "Improved care transitions",
            "Reduced duplications",
            "Better outcomes",
          ],
          integrations: [
            "FHIR CarePlan",
            "Direct messaging",
            "Health information exchanges",
          ],
          pricing: "Per-patient monthly",
        },
        {
          id: 4,
          name: "Surgical Scheduling Optimizer",
          description: "AI-powered OR scheduling to maximize utilization",
          features: [
            "Block optimization",
            "Case duration prediction",
            "Resource allocation",
            "Cancellation prediction",
          ],
          benefits: [
            "10-15% utilization improvement",
            "Reduced turnover time",
            "Better resource planning",
          ],
          integrations: ["EHR scheduling", "OR management systems"],
          pricing: "Enterprise license",
        },
        {
          id: 21,
          name: "EHR Telehealth Integration",
          description:
            "Seamless virtual care embedded directly within EHR workflows",
          features: [
            "One-click video visits from provider apps",
            "Patient portal video launch",
            "SMART on FHIR authentication",
            "Auto-documentation to EHR",
            "Multi-party sessions (family, specialists)",
            "Remote patient monitoring integration",
          ],
          benefits: [
            "Unified clinical experience",
            "No context switching",
            "Complete visit documentation",
            "HIPAA-compliant video",
          ],
          integrations: [
            "FHIR R4 APIs",
            "SMART on FHIR OAuth 2.0",
            "HL7 ADT/SIU",
            "WebRTC video",
          ],
          pricing: "Per-visit or enterprise",
          highlight: true,
        },
      ],
    },
    {
      id: "engagement",
      name: "Patient Engagement",
      icon: "👤",
      color: "from-green-500 to-green-700",
      bgLight: "bg-green-50",
      border: "border-green-200",
      description:
        "Empower patients with digital tools for better health outcomes",
      modules: [
        {
          id: 5,
          name: "Chronic Care Management",
          description:
            "Remote monitoring + care plan adherence for value-based programs",
          features: [
            "Device integration (BP, glucose, weight)",
            "Care plan tracking",
            "Alert escalation",
            "Billing automation",
          ],
          benefits: [
            "Better chronic disease control",
            "CCM/RPM revenue capture",
            "Reduced hospitalizations",
          ],
          integrations: ["Bluetooth/cellular devices", "FHIR Observation"],
          pricing: "Per-patient + devices",
        },
        {
          id: 6,
          name: "Digital Front Door",
          description:
            "Pre-visit registration, insurance verification, and intake",
          features: [
            "Online scheduling",
            "Insurance card OCR",
            "Eligibility check",
            "Digital consents",
            "Copay estimation",
          ],
          benefits: [
            "Reduced wait times",
            "Fewer claim denials",
            "Better patient experience",
          ],
          integrations: ["X12 270/271", "FHIR Patient/Coverage"],
          pricing: "Per-encounter or SaaS",
        },
        {
          id: 7,
          name: "Medication Adherence",
          description: "Smart reminders and pharmacy coordination",
          features: [
            "Multi-channel reminders",
            "Refill coordination",
            "Drug interaction alerts",
            "Adherence analytics",
          ],
          benefits: [
            "Improved PDC scores",
            "Fewer adverse events",
            "Better outcomes",
          ],
          integrations: [
            "NCPDP SCRIPT",
            "Pharmacy networks",
            "FHIR MedicationRequest",
          ],
          pricing: "Per-patient monthly",
        },
        {
          id: 8,
          name: "Post-Discharge Follow-Up",
          description: "Automated check-ins and readmission prevention",
          features: [
            "Automated outreach",
            "Symptom assessment",
            "Risk scoring",
            "Escalation workflows",
          ],
          benefits: [
            "20%+ readmission reduction",
            "Better transitions",
            "Outcome bonuses",
          ],
          integrations: ["ADT feeds", "FHIR Encounter"],
          pricing: "Per-discharge + outcomes",
        },
      ],
    },
    {
      id: "revenue",
      name: "Revenue Cycle",
      icon: "💰",
      color: "from-emerald-500 to-emerald-700",
      bgLight: "bg-emerald-50",
      border: "border-emerald-200",
      description: "Optimize financial performance from claim to collection",
      modules: [
        {
          id: 9,
          name: "AI Denial Management",
          description: "Predict denials before submission and automate appeals",
          features: [
            "Pre-submission prediction",
            "Root cause analysis",
            "Auto-appeal generation",
            "Payer analytics",
          ],
          benefits: [
            "30%+ denial reduction",
            "Faster recovery",
            "Revenue optimization",
          ],
          integrations: ["X12 835/837", "Clearinghouses"],
          pricing: "% of recovered or SaaS",
        },
        {
          id: 10,
          name: "Price Transparency",
          description: "Compliance tools for pricing disclosure requirements",
          features: [
            "Machine-readable files",
            "Good faith estimates",
            "Patient price lookup",
            "Compliance monitoring",
          ],
          benefits: [
            "Regulatory compliance",
            "Patient trust",
            "Competitive positioning",
          ],
          integrations: ["Chargemaster", "Payer contracts"],
          pricing: "Annual license",
        },
        {
          id: 11,
          name: "Patient Financing",
          description: "Embedded payment plans in clinical workflows",
          features: [
            "Payment plan creation",
            "Credit assessment",
            "Financial assistance screening",
            "Collections optimization",
          ],
          benefits: [
            "Improved collections",
            "Patient satisfaction",
            "Reduced bad debt",
          ],
          integrations: ["EHR billing", "Payment processors"],
          pricing: "Transaction fees",
        },
      ],
    },
    {
      id: "analytics",
      name: "Data & Analytics",
      icon: "📊",
      color: "from-purple-500 to-purple-700",
      bgLight: "bg-purple-50",
      border: "border-purple-200",
      description: "Transform healthcare data into actionable insights",
      modules: [
        {
          id: 12,
          name: "Data Normalization Engine",
          description: "Standardize multi-source clinical data for analytics",
          features: [
            "HL7v2 → FHIR transformation",
            "Terminology mapping",
            "Data quality scoring",
            "Patient matching",
          ],
          benefits: [
            "Analytics-ready data",
            "True interoperability",
            "Reduced integration costs",
          ],
          integrations: ["HL7v2", "FHIR R4", "C-CDA", "X12", "Custom files"],
          pricing: "Per-message or enterprise",
          highlight: true,
        },
        {
          id: 13,
          name: "Population Health",
          description: "Risk stratification for ACOs and value-based care",
          features: [
            "Multi-factor risk models",
            "Care gap identification",
            "Quality measure tracking",
            "SDOH integration",
          ],
          benefits: [
            "High-risk patient identification",
            "Quality bonus achievement",
            "Cost reduction",
          ],
          integrations: ["Claims data", "FHIR Bundles", "Health exchanges"],
          pricing: "Per-member monthly",
        },
        {
          id: 14,
          name: "Clinical Trial Matching",
          description: "AI-powered patient-to-trial matching",
          features: [
            "Eligibility parsing",
            "EHR-based matching",
            "Site feasibility",
            "Regulatory compliance",
          ],
          benefits: [
            "Faster enrollment",
            "Research revenue",
            "Patient access to trials",
          ],
          integrations: ["Trial registries", "FHIR ResearchStudy"],
          pricing: "Per-enrolled patient",
        },
      ],
    },
    {
      id: "compliance",
      name: "Compliance & Security",
      icon: "🔒",
      color: "from-red-500 to-red-700",
      bgLight: "bg-red-50",
      border: "border-red-200",
      description: "Automate compliance and protect sensitive health data",
      modules: [
        {
          id: 15,
          name: "HIPAA Compliance Automation",
          description: "Continuous monitoring and audit trail generation",
          features: [
            "Policy templates",
            "Risk assessment automation",
            "Training tracking",
            "Incident management",
            "Audit logs",
          ],
          benefits: [
            "Audit readiness",
            "Reduced compliance burden",
            "Risk mitigation",
          ],
          integrations: ["SIEM platforms", "Cloud providers", "HR systems"],
          pricing: "Per-organization monthly",
          highlight: true,
        },
        {
          id: 16,
          name: "Vendor Risk Management",
          description: "Third-party security and BAA lifecycle management",
          features: [
            "Security questionnaires",
            "Continuous monitoring",
            "BAA management",
            "Risk scoring",
          ],
          benefits: [
            "Third-party visibility",
            "Reduced vendor risk",
            "Compliance documentation",
          ],
          integrations: ["Security rating services", "Contract management"],
          pricing: "Per-vendor or enterprise",
          highlight: true,
        },
        {
          id: 17,
          name: "Medical Device Security",
          description: "IoMT discovery and vulnerability management",
          features: [
            "Device discovery",
            "Vulnerability scanning",
            "Network segmentation",
            "Anomaly detection",
          ],
          benefits: [
            "Device visibility",
            "Reduced attack surface",
            "Regulatory compliance",
          ],
          integrations: ["Network infrastructure", "Asset management"],
          pricing: "Per-device monthly",
        },
      ],
    },
    {
      id: "specialty",
      name: "Specialty Solutions",
      icon: "🎯",
      color: "from-orange-500 to-orange-700",
      bgLight: "bg-orange-50",
      border: "border-orange-200",
      description: "Purpose-built tools for specialized care settings",
      modules: [
        {
          id: 18,
          name: "Behavioral Health Platform",
          description: "EHR + billing + telehealth for mental health practices",
          features: [
            "Therapy note templates",
            "Outcome assessments",
            "Integrated telehealth",
            "Group therapy support",
          ],
          benefits: [
            "Specialty-optimized workflows",
            "Better documentation",
            "Outcome tracking",
          ],
          integrations: [
            "Clearinghouses",
            "WebRTC telehealth",
            "FHIR QuestionnaireResponse",
          ],
          pricing: "Per-provider monthly",
        },
        {
          id: 19,
          name: "Home Health Workforce",
          description: "Scheduling, EVV compliance, and route optimization",
          features: [
            "Electronic visit verification",
            "Route optimization",
            "Mobile caregiver app",
            "Payroll integration",
          ],
          benefits: [
            "Regulatory compliance",
            "Reduced travel time",
            "Better coordination",
          ],
          integrations: ["State EVV systems", "Payroll systems"],
          pricing: "Per-visit or per-caregiver",
        },
        {
          id: 20,
          name: "Imaging Workflow",
          description: "DICOM routing and AI-assisted reading prioritization",
          features: [
            "Intelligent routing",
            "AI triage",
            "Worklist management",
            "Critical findings alerts",
          ],
          benefits: [
            "Faster turnaround",
            "Balanced workloads",
            "Critical case prioritization",
          ],
          integrations: ["DICOM", "HL7 ORM/ORU", "PACS systems"],
          pricing: "Per-study or enterprise",
        },
      ],
    },
  ];

  const ehrIntegrationDetails = {
    title: "EHR Telehealth Integration",
    subtitle: "Seamless Virtual Care Within Your Clinical Workflow",
    overview:
      "Our EHR telehealth integration enables healthcare providers to conduct virtual visits directly from their existing clinical workflows. Using industry-standard FHIR APIs and SMART on FHIR authentication, the platform provides a unified experience for both providers and patients.",

    providerFeatures: [
      {
        title: "Provider Desktop Application",
        description:
          "Launch video visits with one click directly from the provider workflow",
        capabilities: [
          "Integrated patient context",
          "Real-time documentation",
          "Multi-specialty support",
        ],
      },
      {
        title: "Mobile Provider Apps",
        description: "Conduct visits from mobile devices with full EHR access",
        capabilities: [
          "iOS and Android support",
          "Secure authentication",
          "Offline documentation",
        ],
      },
      {
        title: "Clinic-to-Clinic Workflows",
        description:
          "Support teleconsultation between facilities and specialists",
        capabilities: [
          "Remote specialist consults",
          "Multi-party video",
          "Shared screen viewing",
        ],
      },
    ],

    patientFeatures: [
      {
        title: "Patient Portal Integration",
        description: "Patients launch visits from their secure health portal",
        capabilities: [
          "No downloads required",
          "Mobile-optimized",
          "Pre-visit check-in",
        ],
      },
      {
        title: "Flexible Join Options",
        description: "Multiple ways for patients to connect",
        capabilities: ["Email/SMS links", "Portal launch", "QR code access"],
      },
      {
        title: "Family & Caregiver Access",
        description: "Include family members or caregivers in visits",
        capabilities: [
          "Multi-party support",
          "Interpreter services",
          "Care team collaboration",
        ],
      },
    ],

    technicalArchitecture: {
      authentication: {
        title: "SMART on FHIR OAuth 2.0",
        description:
          "Secure, standards-based authentication that leverages existing EHR credentials",
        features: [
          "Single sign-on",
          "Role-based access",
          "Session management",
          "Token refresh",
        ],
      },
      dataExchange: {
        title: "FHIR R4 Data Exchange",
        description:
          "Real-time patient data synchronization using modern healthcare standards",
        resources: [
          "Patient",
          "Appointment",
          "Encounter",
          "DocumentReference",
          "Observation",
        ],
      },
      video: {
        title: "WebRTC Video Infrastructure",
        description:
          "Enterprise-grade video with healthcare-specific optimizations",
        features: [
          "End-to-end encryption",
          "Adaptive bitrate",
          "Low latency",
          "Recording (optional)",
        ],
      },
      documentation: {
        title: "Auto-Documentation",
        description:
          "Visit notes automatically flow back to the patient's record",
        features: [
          "FHIR DocumentReference",
          "C-CDA support",
          "Structured data capture",
        ],
      },
    },

    workflows: [
      {
        name: "Scheduled Video Visit",
        steps: [
          "Appointment created in EHR scheduler",
          "Patient receives confirmation with join instructions",
          "Pre-visit: Patient completes intake questionnaire",
          "Provider launches from worklist → video session opens",
          "Patient joins from portal/email link",
          "Visit conducted with real-time documentation",
          "Post-visit: Notes auto-filed to EHR",
          "Follow-up scheduling and care plan updates",
        ],
      },
      {
        name: "On-Demand Virtual Visit",
        steps: [
          "Patient requests urgent virtual visit",
          "Triage questionnaire completed",
          "Available provider matched",
          "Immediate video session launched",
          "Visit conducted and documented",
          "Prescriptions, referrals as needed",
          "Summary shared with primary care",
        ],
      },
      {
        name: "Remote Monitoring Check-In",
        steps: [
          "Patient vitals received from RPM devices",
          "Alert triggered based on thresholds",
          "Care team notified",
          "Video check-in initiated",
          "Intervention documented",
          "Care plan adjusted if needed",
        ],
      },
    ],

    compliance: [
      {
        standard: "HIPAA",
        status: "Compliant",
        description: "BAA available, encryption at rest/transit",
      },
      {
        standard: "HITRUST",
        status: "Certified",
        description: "CSF certification for healthcare",
      },
      {
        standard: "SOC 2 Type II",
        status: "Attested",
        description: "Annual security attestation",
      },
      {
        standard: "State Regulations",
        status: "Monitored",
        description: "Telehealth licensing compliance",
      },
    ],
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-3xl p-8 text-white">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm mb-4">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Enterprise Healthcare Platform
          </div>
          <h1 className="text-4xl font-bold mb-4">
            {platformOverview.tagline}
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            {platformOverview.description}
          </p>

          <div className="grid grid-cols-4 gap-4">
            {platformOverview.stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur rounded-xl p-4 text-center"
              >
                <div className="text-3xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance & Standards */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">🛡️</span> Compliance Frameworks
          </h3>
          <div className="flex flex-wrap gap-2">
            {platformOverview.compliance.map((c, i) => (
              <span
                key={i}
                className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium"
              >
                ✓ {c}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">🔗</span> Interoperability Standards
          </h3>
          <div className="flex flex-wrap gap-2">
            {platformOverview.standards.map((s, i) => (
              <span
                key={i}
                className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Category Cards */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Platform Capabilities
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setActiveTab("modules");
              }}
              className={`bg-gradient-to-br ${cat.color} rounded-2xl p-6 text-left text-white hover:scale-[1.02] transition-all shadow-lg`}
            >
              <div className="text-4xl mb-3">{cat.icon}</div>
              <h3 className="text-xl font-bold mb-2">{cat.name}</h3>
              <p className="text-white/80 text-sm mb-4">{cat.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                  {cat.modules.length} modules
                </span>
                <span className="text-white/80">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          How The Platform Works
        </h2>
        <div className="grid grid-cols-4 gap-6">
          {[
            {
              step: 1,
              title: "Connect",
              desc: "Integrate with your existing EHR, devices, and systems using standard APIs",
              icon: "🔌",
            },
            {
              step: 2,
              title: "Normalize",
              desc: "Transform disparate data into standardized, analytics-ready formats",
              icon: "⚙️",
            },
            {
              step: 3,
              title: "Automate",
              desc: "Deploy AI-powered workflows for documentation, billing, and care coordination",
              icon: "🤖",
            },
            {
              step: 4,
              title: "Optimize",
              desc: "Gain insights, improve outcomes, and demonstrate value",
              icon: "📈",
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                {item.icon}
              </div>
              <div className="text-sm text-blue-600 font-medium mb-1">
                Step {item.step}
              </div>
              <h4 className="font-bold text-gray-800 mb-2">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderModules = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            !selectedCategory
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All Modules
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              selectedCategory === cat.id
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span>{cat.icon}</span> {cat.name}
          </button>
        ))}
      </div>

      {/* Module Grid */}
      {categories
        .filter((cat) => !selectedCategory || cat.id === selectedCategory)
        .map((category) => (
          <div key={category.id} className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center text-xl`}
              >
                {category.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {category.name}
                </h2>
                <p className="text-sm text-gray-500">{category.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.modules.map((module) => (
                <div
                  key={module.id}
                  className={`${category.bgLight} ${category.border} border-2 rounded-2xl overflow-hidden transition-all ${
                    "highlight" in module && module.highlight
                      ? "ring-2 ring-yellow-400 ring-offset-2"
                      : ""
                  }`}
                >
                  <button
                    type="button"
                    className="w-full text-left p-5 cursor-pointer bg-transparent border-none"
                    onClick={() =>
                      setExpandedModule(
                        expandedModule === module.id ? null : module.id,
                      )
                    }
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`bg-gradient-to-br ${category.color} text-white text-xs font-bold px-2 py-1 rounded`}
                        >
                          #{module.id}
                        </span>
                        {"highlight" in module && module.highlight && (
                          <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
                            ⭐ FEATURED
                          </span>
                        )}
                      </div>
                      <span className="text-gray-400 text-xl">
                        {expandedModule === module.id ? "−" : "+"}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">
                      {module.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {module.description}
                    </p>
                  </button>

                  {expandedModule === module.id && (
                    <div className="px-5 pb-5 space-y-4 border-t border-gray-200 pt-4">
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                          Key Features
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {module.features.map((f, i) => (
                            <span
                              key={i}
                              className="text-xs bg-white px-3 py-1 rounded-full border border-gray-200"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                          Benefits
                        </h4>
                        <ul className="space-y-1">
                          {module.benefits.map((b, i) => (
                            <li
                              key={i}
                              className="text-sm text-gray-700 flex items-center gap-2"
                            >
                              <span className="text-green-500">✓</span> {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                          Integrations
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {module.integrations.map((int, i) => (
                            <span
                              key={i}
                              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                            >
                              {int}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="bg-green-100 text-green-800 text-sm px-4 py-2 rounded-lg">
                        💰 <strong>Pricing:</strong> {module.pricing}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );

  const renderTelehealth = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-3xl p-8 text-white">
        <div className="flex items-center gap-2 text-cyan-200 text-sm mb-2">
          <span>Module #21</span> • <span>Clinical Operations</span>
        </div>
        <h1 className="text-3xl font-bold mb-3">
          {ehrIntegrationDetails.title}
        </h1>
        <p className="text-xl text-cyan-100 max-w-3xl">
          {ehrIntegrationDetails.subtitle}
        </p>
      </div>

      {/* Overview */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <p className="text-gray-600 text-lg leading-relaxed">
          {ehrIntegrationDetails.overview}
        </p>
      </div>

      {/* Provider & Patient Features */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">👨‍⚕️</span> Provider Experience
          </h2>
          <div className="space-y-4">
            {ehrIntegrationDetails.providerFeatures.map((feature, i) => (
              <div key={i} className="bg-white rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {feature.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {feature.capabilities.map((cap, j) => (
                    <span
                      key={j}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">👤</span> Patient Experience
          </h2>
          <div className="space-y-4">
            {ehrIntegrationDetails.patientFeatures.map((feature, i) => (
              <div key={i} className="bg-white rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {feature.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {feature.capabilities.map((cap, j) => (
                    <span
                      key={j}
                      className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technical Architecture */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Technical Architecture
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.values(ehrIntegrationDetails.technicalArchitecture).map(
            (tech, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-gray-800 mb-2">{tech.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{tech.description}</p>
                <div className="flex flex-wrap gap-2">
                  {("features" in tech
                    ? tech.features
                    : "resources" in tech
                      ? tech.resources
                      : []
                  ).map((item, j) => (
                    <span
                      key={j}
                      className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Workflows */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Supported Workflows
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {ehrIntegrationDetails.workflows.map((workflow, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-bold text-gray-800 mb-4">{workflow.name}</h3>
              <ol className="space-y-2">
                {workflow.steps.map((step, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <span className="bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      {j + 1}
                    </span>
                    <span className="text-gray-600">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Compliance & Security
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {ehrIntegrationDetails.compliance.map((item, i) => (
            <div
              key={i}
              className="text-center p-4 bg-green-50 rounded-xl border border-green-100"
            >
              <div className="font-bold text-gray-800">{item.standard}</div>
              <div className="text-xs text-green-600 font-medium mb-2">
                {item.status}
              </div>
              <div className="text-xs text-gray-500">{item.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderIntegrations = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Integration Architecture
      </h2>

      {/* Data Standards */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Healthcare Data Standards
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              name: "FHIR R4",
              desc: "Modern REST-based clinical data exchange",
              use: "Primary interoperability standard",
            },
            {
              name: "HL7v2",
              desc: "Legacy message-based integration",
              use: "ADT, ORM, ORU, SIU messages",
            },
            {
              name: "C-CDA",
              desc: "Clinical document architecture",
              use: "Care summaries, transitions",
            },
            {
              name: "DICOM",
              desc: "Medical imaging standard",
              use: "Radiology, cardiology imaging",
            },
            {
              name: "X12 EDI",
              desc: "Administrative transactions",
              use: "Claims, eligibility, auth",
            },
            {
              name: "NCPDP SCRIPT",
              desc: "Pharmacy transactions",
              use: "E-prescribing, refills",
            },
          ].map((std, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-bold text-blue-600">{std.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{std.desc}</p>
              <p className="text-xs text-gray-500">{std.use}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Terminology */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Terminology Standards
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            { code: "SNOMED CT", domain: "Clinical terms" },
            { code: "LOINC", domain: "Lab observations" },
            { code: "ICD-10-CM", domain: "Diagnoses" },
            { code: "CPT/HCPCS", domain: "Procedures" },
            { code: "RxNorm", domain: "Medications" },
            { code: "NDC", domain: "Drug products" },
            { code: "CVX", domain: "Vaccines" },
            { code: "UCUM", domain: "Units of measure" },
          ].map((term, i) => (
            <div
              key={i}
              className="bg-purple-50 rounded-lg p-3 text-center border border-purple-100"
            >
              <div className="font-bold text-purple-700">{term.code}</div>
              <div className="text-xs text-gray-500">{term.domain}</div>
            </div>
          ))}
        </div>
      </div>

      {/* EHR Systems */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          EHR System Connectivity
        </h3>
        <p className="text-gray-600 mb-4">
          Connect with major electronic health record systems using standardized
          FHIR APIs, SMART on FHIR authentication, and traditional HL7
          interfaces.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <h4 className="font-semibold text-gray-800 mb-2">
              FHIR-Based Integration
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• SMART on FHIR OAuth 2.0 authentication</li>
              <li>• US Core Data for Interoperability (USCDI)</li>
              <li>• Bulk FHIR for population data export</li>
              <li>• CDS Hooks for clinical decision support</li>
            </ul>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <h4 className="font-semibold text-gray-800 mb-2">
              Legacy Integration
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• HL7v2 message parsing and routing</li>
              <li>• MLLP and HTTP transport</li>
              <li>• Interface engine connectivity</li>
              <li>• Flat file processing</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Cloud & Security */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Cloud & Security Infrastructure
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-800 mb-2">☁️ Multi-Cloud</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Healthcare-certified regions</li>
              <li>• Country data residency options</li>
              <li>• Kubernetes orchestration</li>
              <li>• Auto-scaling infrastructure</li>
            </ul>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-800 mb-2">🔐 Security</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Zero-trust architecture</li>
              <li>• AES-256 encryption</li>
              <li>• TLS 1.3 in transit</li>
              <li>• HSM key management</li>
            </ul>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-800 mb-2">📋 Audit</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Immutable audit trails</li>
              <li>• 7-year log retention</li>
              <li>• Real-time anomaly detection</li>
              <li>• Compliance reporting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🏥</span>
              </div>
              <div>
                <div className="font-bold text-gray-900">
                  Unified Health Platform
                </div>
                <div className="text-xs text-gray-500">
                  Enterprise Healthcare Technology
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              {[
                { id: "overview", label: "Overview", icon: "🏠" },
                { id: "modules", label: "Modules", icon: "🧩" },
                { id: "telehealth", label: "EHR Telehealth", icon: "📹" },
                { id: "integrations", label: "Integrations", icon: "🔗" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "overview" && renderOverview()}
        {activeTab === "modules" && renderModules()}
        {activeTab === "telehealth" && renderTelehealth()}
        {activeTab === "integrations" && renderIntegrations()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Multi-tenant • HIPAA/GDPR/POPIA Compliant • SOC 2 Attested
            </div>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>FHIR R4</span>
              <span>•</span>
              <span>HL7v2</span>
              <span>•</span>
              <span>DICOM</span>
              <span>•</span>
              <span>X12 EDI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HealthcarePlatformDashboard;
