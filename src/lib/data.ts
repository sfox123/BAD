import { IconUser, IconSettings, IconEye } from "@tabler/icons-react";
import { Team, Match, Umpire } from "../app/types";

import umpire from "@/img/umpire.jpg";
import ops from "@/img/ops.jpg";

import wfp from "@/img/wfp.png";
import unops from "@/img/unops.png";
import unicef from "@/img/unicef.png";
import undp from "@/img/undp.png";
import unfpa from "@/img/unfpa.png";
import iom from "@/img/iom.png";
import un from "@/img/un.png";

export const teams: Team[] = [
  {
    name: "WFP",
    logo: `${wfp.src}`,
    teams: [
      {
        teamName: "WFP-1",
        Group: "B",
        malePlayers: [
          { FullName: "Abesh POUDEL" },
          { FullName: "Shehan FERNANDO" },
          { FullName: "Mevan BANDARA" },
          { FullName: "Manjula SAMARASEKERA" },
        ],
        femalePlayers: [
          { FullName: "Carol TAYLOR" },
          { FullName: "Vimarsha SALPAGE" },
          { FullName: "Mathilde ACHILLI" },
          { FullName: "Anomi DE MEL" },
          { FullName: "Naary MAXELLA" },
        ],
      },
      {
        teamName: "WFP-2",
        Group: "A",
        malePlayers: [
          { FullName: "Oshantha MERENCHIGE" },
          { FullName: "Mohideen NUSRY" },
          { FullName: "Thevaraj VIKNESHAN" },
          { FullName: "Irfan MOHAMED" },
          { FullName: "Thangaraj SHAGAR" },
          { FullName: "Dilum SITHARA" },
        ],
        femalePlayers: [
          { FullName: "Heshani RANASINGHE" },
          { FullName: "Gothami CHANDRARATNE" },
          { FullName: "Nuranjani OKANDAPOLA" },
          { FullName: "Naadira HASSEN" },
          { FullName: "Samadhee ATTANAYAKE" },
          { FullName: "Harshani RANAWANA" },
        ],
      },
    ],
  },
  {
    name: "UNOPS",
    logo: `${unops.src}`,
    teams: [
      {
        teamName: "UNOPS-1",
        Group: "A",
        malePlayers: [
          { FullName: "Richerd Amos Rajaratnam" },
          { FullName: "Edirisinghe Mudiyanselage Sithmi Nimashi Edirisinghe" },
          { FullName: "Chamith B Fernando" },
          { FullName: "Charles Callanan" },
          {
            FullName:
              "Doloswala Thiyambarawatte Toshan Mahesh Thushara JAYATHISSA",
          },
          { FullName: "Eranga Perera" },
          { FullName: "Himath Weraduwa" },
          { FullName: "Jaime Alarma Olmos" },
          { FullName: "Priyanga W. Jayasekara" },
          { FullName: "Sivalingam Sivashankar" },
          { FullName: "Sivananthavadivel Sivashangar" },
          { FullName: "Thushan Duminda Jayaratne" },
          { FullName: "Vijayapala Sinnathamby" },
        ],
        femalePlayers: [
          { FullName: "Amenthi Tarika Jasinghe" },
          { FullName: "Yasodhara Kariyawasam" },
          {
            FullName:
              "Amarasingha Pathirannehelage Don Rashmi Sakunthala Kumari Amarasingha",
          },
          { FullName: "R.H.M.Imasha Bhagya Lakshmiwewa" },
          { FullName: "Yasasi Gayara Rathnabarana" },
          { FullName: "Subashini Kaneshwaren" },
          { FullName: "Gamage Anjalee Pitadeniya" },
          { FullName: "Kalyani Sivanathan" },
          { FullName: "Sripalee Ayanthi De Silva Gardiya Manawaduge" },
          { FullName: "Eunhye Cathy Lee" },
        ],
      },
      {
        teamName: "UNOPS-2",
        Group: "B",
        malePlayers: [
          { FullName: "Richerd Amos Rajaratnam" },
          { FullName: "Edirisinghe Mudiyanselage Sithmi Nimashi Edirisinghe" },
          { FullName: "Chamith B Fernando" },
          { FullName: "Charles Callanan" },
          {
            FullName:
              "Doloswala Thiyambarawatte Toshan Mahesh Thushara JAYATHISSA",
          },
          { FullName: "Eranga Perera" },
          { FullName: "Himath Weraduwa" },
          { FullName: "Jaime Alarma Olmos" },
          { FullName: "Priyanga W. Jayasekara" },
          { FullName: "Sivalingam Sivashankar" },
          { FullName: "Sivananthavadivel Sivashangar" },
          { FullName: "Thushan Duminda Jayaratne" },
          { FullName: "Vijayapala Sinnathamby" },
        ],
        femalePlayers: [
          { FullName: "Amenthi Tarika Jasinghe" },
          { FullName: "Yasodhara Kariyawasam" },
          {
            FullName:
              "Amarasingha Pathirannehelage Don Rashmi Sakunthala Kumari Amarasingha",
          },
          { FullName: "R.H.M.Imasha Bhagya Lakshmiwewa" },
          { FullName: "Yasasi Gayara Rathnabarana" },
          { FullName: "Subashini Kaneshwaren" },
          { FullName: "Gamage Anjalee Pitadeniya" },
          { FullName: "Kalyani Sivanathan" },
          { FullName: "Sripalee Ayanthi De Silva Gardiya Manawaduge" },
          { FullName: "Eunhye Cathy Lee" },
        ],
      },
    ],
  },
  {
    name: "WHO UNICEF",
    logo: `${unicef.src}`,
    teams: [
      {
        teamName: "Team 1",
        Group: "B",
        malePlayers: [
          { FullName: "Sanjeewa Warusawitharana" },
          { FullName: "Abner Daniel" },
          { FullName: "Sapumal Dhanapala" },
          { FullName: "Sameera Hewage" },
          { FullName: "Ranjan Suriyabandara" },
          { FullName: "Noyalganth Rajkumar" },
        ],
        femalePlayers: [
          { FullName: "Yenuli Amaratunga" },
          { FullName: "Mithuni Jayawardana" },
          { FullName: "Geethani Dissanayake" },
          { FullName: "Kumudini Ragel" },
          { FullName: "Nalin de Silva" },
          { FullName: "Iresha Peiris" },
        ],
      },
    ],
  },
  {
    name: "UNDP",
    logo: `${undp.src}`,
    teams: [
      {
        teamName: "UNDP-1",
        Group: "A",
        malePlayers: [
          { FullName: "Yasas Thalagala" },
          { FullName: "Rasu Xavier" },
          { FullName: "Dhaanish Mohamed" },
          { FullName: "Varuna Ponnamperuma" },
          { FullName: "Mohammed Imthiyas" },
        ],
        femalePlayers: [
          { FullName: "Kithmini Nissanka" },
          { FullName: "Petricia Wijetunga" },
          { FullName: "Wenqian Zhou" },
          { FullName: "Myanthi Peiris" },
        ],
      },
      {
        teamName: "UNDP-2",
        Group: "B",
        malePlayers: [
          { FullName: "Lakmaal Rodrigo" },
          { FullName: "Heshoban Thavakumaran" },
          { FullName: "Chathuranga Hapuarachchi" },
          { FullName: "Rakitha Abhayaratne" },
          { FullName: "Nuwan Perera" },
        ],
        femalePlayers: [
          { FullName: "Kendra Gomez" },
          { FullName: "Deshani Senanayake" },
          { FullName: "Lihini Ratwatte" },
          { FullName: "Janethree Kulawardhana" },
        ],
      },
    ],
  },
  {
    name: "UNFPA",
    logo: `${unfpa.src}`,
    teams: [
      {
        teamName: "Team 1",
        Group: "A",
        malePlayers: [
          { FullName: "Benjamin Sinathurai" },
          { FullName: "Ratan Khisha" },
          { FullName: "Nimalesan Arumugum" },
          { FullName: "Samuel Selvaraja" },
          { FullName: "Tharanga Dissanayake" },
          { FullName: "Gnanageshan Chellappah" },
          { FullName: "Muditha Abeywickrama" },
        ],
        femalePlayers: [
          { FullName: "Anushika Amarasinghe" },
          { FullName: "Anusha Allas" },
          { FullName: "Yuki haramoto" },
          { FullName: "Dayenkie Chandrasekera" },
          { FullName: "Poorani Radhakrishnan" },
        ],
      },
    ],
  },
  {
    name: "IOM",
    logo: `${iom.src}`,
    teams: [
      {
        teamName: "IOM-1",
        Group: "B",
        malePlayers: [
          { FullName: "Aruna Dishantha" },
          { FullName: "Antontte Amritha Muttiah" },
          { FullName: "Buddhika Sampath Darshana" },
          { FullName: "Eswaran Kathiresan" },
          { FullName: "Gayan Karunarathna" },
        ],
        femalePlayers: [
          { FullName: "Roshani Elizabeth Perera" },
          { FullName: "Kiruthika Mahenthiran" },
          { FullName: "Lakshika De Silva" },
          { FullName: "Keerthi Sri Priyankara" },
        ],
      },
      {
        teamName: "IOM-2",
        Group: "A",
        malePlayers: [
          { FullName: "Rajitha Goonerathne" },
          { FullName: "Tharindu Jayawardhane" },
          { FullName: "Mohamed Rifak" },
          { FullName: "Nuwan Meenana Kolath" },
        ],
        femalePlayers: [
          { FullName: "Dinu Tharaka" },
          { FullName: "Maheshika K.Asurumuni" },
          { FullName: "Shashikala P.Warnakulasuriya" },
          { FullName: "Abilashini Ramakrishnan" },
          { FullName: "Pragasinya Ambikaibahan" },
          { FullName: "Nishanthy Nishanth" },
        ],
      },
    ],
  },
  {
    name: "RCO FAO DSS",
    logo: `${un.src}`,
    teams: [
      {
        teamName: "Team 1",
        Group: "A",
        malePlayers: [
          { FullName: "Andrea Karoat" },
          { FullName: "David Blackman" },
          { FullName: "Sudesh Mirihana Arachchige Chaminda" },
          { FullName: "Hettiarachchige Sudath Kumara" },
        ],
        femalePlayers: [
          { FullName: "Nehama Jayawardene" },
          { FullName: "Sofla Lindell" },
          { FullName: "Malini Makawita Gamage" },
          { FullName: "Subatheesh Sudharshani Ahila" },
        ],
      },
    ],
  },
];

export const match: Match[] = [
  {
    name: "MS",
    values: [1, 2, 3],
    playerCount: 1,
  },
  {
    name: "WS",
    values: [1, 2],
    playerCount: 1,
  },
  {
    name: "MD",
    values: [1, 2],
    playerCount: 2,
  },
  {
    name: "WD",
    values: [1],
    playerCount: 2,
  },
  {
    name: "XD",
    values: [1, 2],
    playerCount: 2,
  },
];

export const buttonData = [
  {
    name: "UMPIRE",
    icon: IconUser,
    before: `${umpire.src}`,
    after: `${umpire.src}`,
  },
  {
    name: "OPERATOR",
    icon: IconSettings,
    before: `${ops.src}`,
    after: `${ops.src}`,
  },
  {
    name: "AUDIENCE",
    icon: IconEye,
    before: "https://i.ibb.co/zSDZwnB/crowd.jpg",
    after:
      "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOG5qYmRnYW5seGxuaWd6eWk0NDJ5cWNzNTNvZ2dwempocTlxeTE1bCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26FxCOdhlvEQXbeH6/giphy.gif",
  },
];

export const UmpireData: Umpire[] = [
  {
    name: "Court 1",
    pin: "1111",
  },
  {
    name: "Court 2",
    pin: "2222",
  },
  {
    name: "Court 3",
    pin: "3333",
  },
  {
    name: "Court 4",
    pin: "4444",
  },
  {
    name: "Court 5",
    pin: "5555",
  },
];
