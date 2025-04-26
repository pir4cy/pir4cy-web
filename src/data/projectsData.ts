import { Project } from '../types/project';

export const projects: Project[] = [
  {
    id: 'secure-chat',
    title: 'Secure Chat',
    description: 'End-to-end encrypted messaging app with zero knowledge architecture',
    tags: ['React', 'Node.js', 'WebRTC', 'Encryption'],
    imageUrl: 'https://images.pexels.com/photos/7319076/pexels-photo-7319076.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    demoUrl: 'https://example.com/demo',
    githubUrl: 'https://github.com/example/secure-chat',
    featured: true,
    date: '2023-12-15'
  },
  {
    id: 'blockchain-explorer',
    title: 'Blockchain Explorer',
    description: 'Visualization tool for blockchain transactions and smart contracts',
    tags: ['TypeScript', 'Web3', 'D3.js', 'Ethereum'],
    imageUrl: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    demoUrl: 'https://example.com/demo',
    githubUrl: 'https://github.com/example/blockchain-explorer',
    featured: true,
    date: '2023-10-21'
  },
  {
    id: 'system-monitor',
    title: 'System Monitor',
    description: 'Real-time monitoring dashboard for Linux systems',
    tags: ['Python', 'Flask', 'WebSockets', 'Linux'],
    imageUrl: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    demoUrl: 'https://example.com/demo',
    githubUrl: 'https://github.com/example/system-monitor',
    date: '2023-09-08'
  },
  {
    id: 'network-toolkit',
    title: 'Network Toolkit',
    description: 'Collection of network diagnostic and packet analysis tools',
    tags: ['Go', 'Networking', 'Security', 'CLI'],
    imageUrl: 'https://images.pexels.com/photos/4497187/pexels-photo-4497187.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    githubUrl: 'https://github.com/example/network-toolkit',
    date: '2023-07-12'
  },
  {
    id: 'quantum-simulator',
    title: 'Quantum Simulator',
    description: 'Quantum computing circuit simulator with interactive visualizations',
    tags: ['Rust', 'WebAssembly', 'Linear Algebra', 'Physics'],
    imageUrl: 'https://images.pexels.com/photos/4356133/pexels-photo-4356133.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    demoUrl: 'https://example.com/demo',
    githubUrl: 'https://github.com/example/quantum-simulator',
    date: '2023-05-30'
  },
  {
    id: 'ai-playground',
    title: 'AI Playground',
    description: 'Interactive platform for experimenting with different machine learning models',
    tags: ['Python', 'TensorFlow', 'React', 'Docker'],
    imageUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    demoUrl: 'https://example.com/demo',
    githubUrl: 'https://github.com/example/ai-playground',
    date: '2023-03-14'
  }
];