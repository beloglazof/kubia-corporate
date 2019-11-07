const cardStates = [
  {
    id: 1,
    name: 'PREPARE',
    default: 'Y'
  },
  {
    id: 2,
    name: 'CREATED',
    default: 'N'
  },
  {
    id: 3,
    name: 'CREATE_FAILED',
    default: 'N'
  },
  {
    id: 4,
    name: 'BLOCKED',
    default: 'N'
  },
  {
    id: 5,
    name: 'ARCHIVED',
    default: 'N'
  }
];

// 1. request cards/new -> PREPARE
// 2. if success CREATED
// 3. if not CREATE_FAILED
// 4. BLOCKED
// 5. ARCHIVED

export default cardStates;
