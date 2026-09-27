const fs = require('fs');
const path = require('path');
const os = require('os');

const DATA_DIR = process.env.VERCEL ? path.join(os.tmpdir(), 'research_os_data') : path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.error('Failed to create DATA_DIR:', e);
  }
}

// Initial Database Structure
const initialData = {
  users: [
    {
      id: 'usr_demo',
      email: 'researcher@demo.com',
      passwordHash: '$2a$10$wVbQp/q956H8sH2mXy42z.0YfQ3p1z2X3Y4Z5W6V7U8T9S0R1Q2P', // demo123
      name: 'Dr. Alex Vance',
      institution: 'AI & Data Science Lab',
      apiKey: 'AQ.Ab8RN6LwiLQgGvG_VyZVVA24I_rwcMCZY5Q9ksGw84G9bK-bJw',
      createdAt: new Date().toISOString()
    }
  ],
  projects: [
    {
      id: 'proj_demo_rag',
      userId: 'usr_demo',
      title: 'Generative AI & RAG Benchmarks',
      description: 'Comparative analysis of Transformer architectures, RAG synthesis, and deep residual networks.',
      paperIds: ['paper_transformer', 'paper_rag', 'paper_resnet', 'paper_gan'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  papers: [
    {
      id: 'paper_transformer',
      projectId: 'proj_demo_rag',
      title: 'Attention Is All You Need',
      authors: 'Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin',
      year: 2017,
      venue: 'NeurIPS 2017',
      doi: '10.48550/arXiv.1706.03762',
      fileUrl: '/sample_docs/transformer.pdf',
      pageCount: 15,
      abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. We propose the Transformer, a novel architecture based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.',
      summary: {
        executive: 'Introduces the Transformer model architecture based exclusively on self-attention mechanisms, replacing recurrent networks (RNN/LSTM) and sequential processing with parallelizable self-attention.',
        methodology: 'Encoder-decoder structure with Multi-Head Attention, Scaled Dot-Product Attention, and Positional Encodings.',
        findings: 'Achieved 28.4 BLEU on English-to-German and 41.8 BLEU on English-to-French translation, outperforming previous state-of-the-art models with significantly lower training time.',
        limitations: 'Quadratic computational complexity O(N^2) with sequence length; high memory overhead for long context sequences.',
        futureScope: 'Linear attention mechanisms, long-context window extensions, multi-modal integration.'
      },
      tags: ['Transformers', 'Attention', 'NLP', 'Deep Learning'],
      chunks: [
        { id: 'c1', page: 1, text: 'We propose the Transformer, a model architecture eschewing recurrence and instead relying entirely on an attention mechanism to draw global dependencies between input and output. The Transformer allows for significantly more parallelization and can reach a new state of the art in translation quality after being trained for only twelve hours on eight P100 GPUs.' },
        { id: 'c2', page: 3, text: 'An attention function can be described as mapping a query and a set of key-value pairs to an output, where the query, keys, values, and output are all vectors. The output is computed as a weighted sum of the values, where the weight assigned to each value is computed by a compatibility function of the query with the corresponding key.' },
        { id: 'c3', page: 5, text: 'Multi-Head Attention allows the model to jointly attend to information from different representation subspaces at different positions. With single attention head, averaging inhibits this. MultiHead(Q, K, V) = Concat(head_1, ..., head_h)W^O where head_i = Attention(QW_i^Q, KW_i^K, VW_i^V).' },
        { id: 'c4', page: 8, text: 'Positional Encoding: Since our model contains no recurrence and no convolution, in order for the model to make use of the order of the sequence, we must inject some information about the relative or absolute position of the tokens in the sequence. We use sine and cosine functions of different frequencies.' }
      ]
    },
    {
      id: 'paper_rag',
      projectId: 'proj_demo_rag',
      title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
      authors: 'Patrick Lewis, Ethan Perez, Aleksandrs Piktus, Fabio Petroni, Vladimir Karpukhin, Naman Goyal, Heinrich Küttler, Mike Lewis, Wen-tau Yih, Tim Rocktäschel, Sebastian Riedel, Douwe Kiela',
      year: 2020,
      venue: 'NeurIPS 2020',
      doi: '10.48550/arXiv.2005.11401',
      fileUrl: '/sample_docs/rag.pdf',
      pageCount: 12,
      abstract: 'Large pre-trained language models have been shown to store factual knowledge in their parameters. However, their ability to access and precisely manipulate knowledge is still limited. We explore Retrieval-Augmented Generation (RAG) models which combine parametric memory with non-parametric memory.',
      summary: {
        executive: 'Combines a pre-trained sequence-to-sequence model (BART) with a dense vector index (DPR) to retrieve relevant Wikipedia documents dynamically during text generation.',
        methodology: 'Dense Passage Retrieval (DPR) for retriever, BART generator, trained end-to-end using marginal likelihood of target sequences.',
        findings: 'Sets new state-of-the-art results on Open-Domain QA (Natural Questions, TriviaQA, WebQuestions) and generates more factual, specific responses with fewer hallucinations.',
        limitations: 'Retrieval latency added to generation; retriever quality bounds overall system performance; index update requires re-embedding corpus.',
        futureScope: 'Real-time online retriever updates, multi-modal retrieval, adaptive retrieval frequency.'
      },
      tags: ['RAG', 'Retrieval', 'LLMs', 'Information Retrieval'],
      chunks: [
        { id: 'c10', page: 1, text: 'We build RAG models where the parametric memory is a pre-trained seq2seq transformer, and the non-parametric memory is a dense vector index of Wikipedia, accessed with a pre-trained neural retriever (Dense Passage Retriever, DPR).' },
        { id: 'c11', page: 3, text: 'RAG-Sequence Model uses the same retrieved document to generate the complete sequence. RAG-Token Model can retrieve different documents for each generated token, allowing multi-document synthesis.' },
        { id: 'c12', page: 6, text: 'On Natural Questions, RAG achieves 44.1% exact match score, outperforming T5-11B which stores knowledge purely in parameters. RAG models produce responses that are more factual and less hallucinated.' }
      ]
    },
    {
      id: 'paper_resnet',
      projectId: 'proj_demo_rag',
      title: 'Deep Residual Learning for Image Recognition',
      authors: 'Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun',
      year: 2016,
      venue: 'CVPR 2016 (Best Paper)',
      doi: '10.1109/CVPR.2016.90',
      fileUrl: '/sample_docs/resnet.pdf',
      pageCount: 12,
      abstract: 'Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those used previously. We explicitly reformulate the layers as learning residual functions with reference to the layer inputs.',
      summary: {
        executive: 'Solves the degradation problem in extremely deep neural networks using skip connections (residual shortcuts) to optimize networks with 100+ layers.',
        methodology: 'Residual blocks F(x) + x, bottleneck layers, batch normalization, identity mapping.',
        findings: 'Won 1st place in ILSVRC 2015 classification with ResNet-152 (3.57% top-5 error) and COCO object detection.',
        limitations: 'High memory footprint during training; high parameter redundancy in deeper blocks.',
        futureScope: 'Dense networks (DenseNet), residual transformers (ResNeXt, ConvNeXt).'
      },
      tags: ['Computer Vision', 'Residual Networks', 'Deep Learning', 'ImageNet'],
      chunks: [
        { id: 'c20', page: 1, text: 'Deeper neural networks suffer from degradation: as network depth increases, accuracy gets saturated and then degrades rapidly. We address degradation by introducing a deep residual learning framework.' },
        { id: 'c21', page: 4, text: 'Instead of hoping each stacked layer directly fits a desired underlying mapping H(x), we explicitly let these layers fit a residual mapping F(x) := H(x) - x. The original mapping is reformulated into F(x) + x.' }
      ]
    },
    {
      id: 'paper_gan',
      projectId: 'proj_demo_rag',
      title: 'Generative Adversarial Nets',
      authors: 'Ian J. Goodfellow, Jean Pouget-Abadie, Mehdi Mirza, Bing Xu, David Warde-Farley, Sherjil Ozair, Aaron Courville, Yoshua Bengio',
      year: 2014,
      venue: 'NIPS 2014',
      doi: '10.48550/arXiv.1406.2661',
      fileUrl: '/sample_docs/gan.pdf',
      pageCount: 9,
      abstract: 'We propose a new framework for estimating generative models via an adversarial process, in which we simultaneously train two models: a generative model G that captures the data distribution, and a discriminative model D that estimates the probability that a sample came from the training data rather than G.',
      summary: {
        executive: 'Formulates generative modeling as a minimax two-player game between a Generator and a Discriminator.',
        methodology: 'Adversarial minimax objective min_G max_D V(D, G), backpropagation on both networks.',
        findings: 'Successfully generated sharp image samples on MNIST, TFD, and CIFAR-10 without Markov chains or unrolled graph inferences.',
        limitations: 'Training instability, mode collapse, vanishing gradients for generator.',
        futureScope: 'Conditional GANs, StyleGAN, Diffusion Models.'
      },
      tags: ['Generative AI', 'GANs', 'Adversarial Learning', 'Deep Learning'],
      chunks: [
        { id: 'c30', page: 1, text: 'The generative model can be thought of as analogous to a team of counterfeiters, trying to produce fake currency and use it without detection, while the discriminative model is analogous to the police, trying to detect the counterfeit currency.' }
      ]
    }
  ],
  bookmarks: [
    {
      id: 'b1',
      userId: 'usr_demo',
      paperId: 'paper_transformer',
      paperTitle: 'Attention Is All You Need',
      text: 'Multi-Head Attention allows the model to jointly attend to information from different representation subspaces at different positions.',
      note: 'Key architectural insight for multi-head projections.',
      page: 5,
      color: 'yellow',
      createdAt: new Date().toISOString()
    }
  ],
  notes: [
    {
      id: 'n1',
      userId: 'usr_demo',
      projectId: 'proj_demo_rag',
      title: 'RAG vs Parametric LLMs Synthesis',
      content: 'RAG provides updated context without retraining costs. Compare DPR accuracy against T5 fine-tuning.',
      createdAt: new Date().toISOString()
    }
  ]
};

function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database file:', err);
    return initialData;
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing database file:', err);
  }
}

module.exports = {
  readDB,
  writeDB
};
