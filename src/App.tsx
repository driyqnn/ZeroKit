import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AboutPrivacy from "./pages/AboutPrivacy";

// Tools
import ApiTester from "./pages/tools/ApiTester";
import Base64Tool from "./pages/tools/Base64Tool";
import BMICalculator from "./pages/tools/BMICalculator";
import BudgetTracker from "./pages/tools/BudgetTracker";
import WordCounter from "./pages/tools/WordCounter";
import ChemicalElements from "./pages/tools/ChemicalElements";
import CircuitAnalyzer from "./pages/tools/CircuitAnalyzer";
import CitationGenerator from "./pages/tools/CitationGenerator";
import CodeObfuscator from "./pages/tools/CodeObfuscator";
import ColorPaletteGenerator from "./pages/tools/ColorPaletteGenerator";
import ContrastChecker from "./pages/tools/ContrastChecker";
import CronGenerator from "./pages/tools/CronGenerator";
import CssAnimationGenerator from "./pages/tools/CssAnimationGenerator";
import CssFlexboxGridGenerator from "./pages/tools/CssFlexboxGridGenerator";
import CssMinifier from "./pages/tools/CssMinifier";
import CurrencyConverter from "./pages/tools/CurrencyConverter";
import DataSorting from "./pages/tools/DataSorting";
import DiceRoller from "./pages/tools/DiceRoller";
import DictionaryThesaurus from "./pages/tools/DictionaryThesaurus";
import DrawingBoard from "./pages/tools/DrawingBoard";
import EncryptionPlayground from "./pages/tools/EncryptionPlayground";
import FluidDynamicsCalculator from "./pages/tools/FluidDynamicsCalculator";
import ForceCalculator from "./pages/tools/ForceCalculator";
import GithubTools from "./pages/tools/GithubTools";
import GeneralAverageCalculator from "./pages/tools/GeneralAverageCalculator";
import GWACalculator from "./pages/tools/GWACalculator";
import HashGenerator from "./pages/tools/HashGenerator";
import HexColorConverter from "./pages/tools/HexColorConverter";
import HtmlEntityConverter from "./pages/tools/HtmlEntityConverter";
import HttpStatusCodes from "./pages/tools/HttpStatusCodes";
import IdeaGenerator from "./pages/tools/IdeaGenerator";
import StoryIdeaGenerator from "./pages/tools/StoryIdeaGenerator";
import ImageCompressor from "./pages/tools/ImageCompressor";
import InvoiceGenerator from "./pages/tools/InvoiceGenerator";
import JsonFormatter from "./pages/tools/JsonFormatter";
import JsonYamlConverter from "./pages/tools/JsonYamlConverter";
import JwtDecoder from "./pages/tools/JwtDecoder";
import LoadSimulator from "./pages/tools/LoadSimulator";
import LoanCalculator from "./pages/tools/LoanCalculator";
import LoremIpsumGenerator from "./pages/tools/LoremIpsumGenerator";
import MarkdownEditor from "./pages/tools/MarkdownEditor";
import MarketRush from "./pages/tools/MarketRush";
import MatrixCalculator from "./pages/tools/MatrixCalculator";
import MealPlanner from "./pages/tools/MealPlanner";
import MetadataRemover from "./pages/tools/MetadataRemover";
import PasswordGame from "./pages/tools/PasswordGame";
import PasswordGenerator from "./pages/tools/PasswordGenerator";
import PasswordSecurity from "./pages/tools/PasswordSecurity";
import PasswordStrengthTester from "./pages/tools/PasswordStrengthTester";
import PhysicsCalculator from "./pages/tools/PhysicsCalculator";
import PrivateNotes from "./pages/tools/PrivateNotes";
import QRCodeGenerator from "./pages/tools/QRCodeGenerator";
import ReadabilityScoreChecker from "./pages/tools/ReadabilityScoreChecker";
import RegexTester from "./pages/tools/RegexTester";
import SqlFormatter from "./pages/tools/SqlFormatter";
import StatisticalCalculator from "./pages/tools/StatisticalCalculator";
import StockMarketGame from "./pages/tools/StockMarketGame";
import StressCalculator from "./pages/tools/StressCalculator";
import SvgOptimizer from "./pages/tools/SvgOptimizer";
import TextCaseConverter from "./pages/tools/TextCaseConverter";
import TextSplitter from "./pages/tools/TextSplitter";
import ThermodynamicsAssistant from "./pages/tools/ThermodynamicsAssistant";
import TimeZoneConverter from "./pages/tools/TimeZoneConverter";
import TodoList from "./pages/tools/TodoList";
import TrigonometrySolver from "./pages/tools/TrigonometrySolver";
import TypingSpeedTest from "./pages/tools/TypingSpeedTest";
import UnitConverter from "./pages/tools/UnitConverter";
import UUIDGenerator from "./pages/tools/UUIDGenerator";
import WebhookTester from "./pages/tools/WebhookTester";
import CSSGradientGenerator from "./pages/tools/CSSGradientGenerator";
import MetaTagPreviewer from "./pages/tools/MetaTagPreviewer";
import OpengraphGenerator from "./pages/tools/OpengraphGenerator";
import ResponsiveTester from "./pages/tools/ResponsiveTester";
import SiteDownChecker from "./pages/tools/SiteDownChecker";
import UrlParser from "./pages/tools/UrlParser";
import HtmlValidator from "./pages/tools/HtmlValidator";
import WebsitePerformance from "./pages/tools/WebsitePerformance";
import SchemaGenerator from "./pages/tools/SchemaGenerator";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about-privacy" element={<AboutPrivacy />} />

        {/* Developer Tools */}
        <Route path="/tools/api-tester" element={<ApiTester />} />
        <Route path="/tools/base64-encoder-decoder" element={<Base64Tool />} />
        <Route path="/tools/code-obfuscator" element={<CodeObfuscator />} />
        <Route
          path="/tools/cron-expression-generator"
          element={<CronGenerator />}
        />
        <Route path="/tools/css-minifier" element={<CssMinifier />} />
        <Route path="/tools/github-tools" element={<GithubTools />} />
        <Route path="/tools/hash-generator" element={<HashGenerator />} />
        <Route
          path="/tools/html-entity-converter"
          element={<HtmlEntityConverter />}
        />
        <Route path="/tools/http-status-codes" element={<HttpStatusCodes />} />
        <Route path="/tools/json-formatter" element={<JsonFormatter />} />
        <Route
          path="/tools/json-yaml-converter"
          element={<JsonYamlConverter />}
        />
        <Route path="/tools/jwt-decoder" element={<JwtDecoder />} />
        <Route path="/tools/regex-tester" element={<RegexTester />} />
        <Route path="/tools/sql-formatter" element={<SqlFormatter />} />
        <Route path="/tools/uuid-generator" element={<UUIDGenerator />} />
        <Route path="/tools/webhook-tester" element={<WebhookTester />} />

        {/* Web & SEO Tools */}
        <Route
          path="/tools/meta-tag-previewer"
          element={<MetaTagPreviewer />}
        />
        <Route
          path="/tools/opengraph-generator"
          element={<OpengraphGenerator />}
        />
        <Route path="/tools/responsive-tester" element={<ResponsiveTester />} />
        <Route path="/tools/site-down-checker" element={<SiteDownChecker />} />
        <Route path="/tools/url-parser" element={<UrlParser />} />
        <Route path="/tools/html-validator" element={<HtmlValidator />} />
        <Route
          path="/tools/website-performance"
          element={<WebsitePerformance />}
        />
        <Route path="/tools/schema-generator" element={<SchemaGenerator />} />

        {/* Engineering Tools */}
        <Route path="/tools/circuit-analyzer" element={<CircuitAnalyzer />} />
        <Route
          path="/tools/fluid-dynamics-calculator"
          element={<FluidDynamicsCalculator />}
        />
        <Route path="/tools/force-calculator" element={<ForceCalculator />} />
        <Route path="/tools/load-simulator" element={<LoadSimulator />} />
        <Route
          path="/tools/physics-calculator"
          element={<PhysicsCalculator />}
        />
        <Route path="/tools/stress-calculator" element={<StressCalculator />} />
        <Route
          path="/tools/thermodynamics-assistant"
          element={<ThermodynamicsAssistant />}
        />
        <Route
          path="/tools/trigonometry-solver"
          element={<TrigonometrySolver />}
        />

        {/* Privacy & Security Tools */}
        <Route
          path="/tools/encryption-playground"
          element={<EncryptionPlayground />}
        />
        <Route path="/tools/metadata-remover" element={<MetadataRemover />} />
        <Route
          path="/tools/password-generator"
          element={<PasswordGenerator />}
        />
        <Route path="/tools/password-security" element={<PasswordSecurity />} />
        <Route
          path="/tools/password-strength-tester"
          element={<PasswordStrengthTester />}
        />
        <Route path="/tools/password-game" element={<PasswordGame />} />

        {/* Design & Media Tools */}
        <Route
          path="/tools/color-palette-generator"
          element={<ColorPaletteGenerator />}
        />
        <Route path="/tools/contrast-checker" element={<ContrastChecker />} />
        <Route
          path="/tools/css-animation-generator"
          element={<CssAnimationGenerator />}
        />
        <Route
          path="/tools/css-flexbox-grid-generator"
          element={<CssFlexboxGridGenerator />}
        />
        <Route
          path="/tools/css-gradient-generator"
          element={<CSSGradientGenerator />}
        />
        <Route path="/tools/drawing-board" element={<DrawingBoard />} />
        <Route
          path="/tools/hex-color-converter"
          element={<HexColorConverter />}
        />
        <Route path="/tools/image-compressor" element={<ImageCompressor />} />
        <Route path="/tools/svg-optimizer" element={<SvgOptimizer />} />

        {/* Academic Tools */}
        <Route path="/tools/chemical-elements" element={<ChemicalElements />} />
        <Route
          path="/tools/citation-generator"
          element={<CitationGenerator />}
        />
        <Route
          path="/tools/dictionary-thesaurus"
          element={<DictionaryThesaurus />}
        />
        <Route path="/tools/gwa-calculator" element={<GWACalculator />} />
        <Route
          path="/tools/general-average-calculator"
          element={<GeneralAverageCalculator />}
        />
        <Route path="/tools/matrix-calculator" element={<MatrixCalculator />} />
        <Route
          path="/tools/readability-score-checker"
          element={<ReadabilityScoreChecker />}
        />
        <Route
          path="/tools/statistical-calculator"
          element={<StatisticalCalculator />}
        />

        {/* Writing Tools */}
        <Route path="/tools/word-counter" element={<WordCounter />} />
        <Route
          path="/tools/lorem-ipsum-generator"
          element={<LoremIpsumGenerator />}
        />
        <Route path="/tools/markdown-editor" element={<MarkdownEditor />} />
        <Route
          path="/tools/text-case-converter"
          element={<TextCaseConverter />}
        />
        <Route path="/tools/text-splitter" element={<TextSplitter />} />
        <Route path="/tools/typing-speed-test" element={<TypingSpeedTest />} />
        <Route
          path="/tools/readability-score"
          element={<ReadabilityScoreChecker />}
        />

        {/* Productivity Tools */}
        <Route path="/tools/idea-generator" element={<IdeaGenerator />} />
        <Route path="/tools/private-notes" element={<PrivateNotes />} />
        <Route path="/tools/qr-code-generator" element={<QRCodeGenerator />} />
        <Route
          path="/tools/story-idea-generator"
          element={<StoryIdeaGenerator />}
        />
        <Route path="/tools/todo-list" element={<TodoList />} />

        {/* Converters & Calculators */}
        <Route
          path="/tools/currency-converter"
          element={<CurrencyConverter />}
        />
        <Route path="/tools/data-sorting" element={<DataSorting />} />
        <Route
          path="/tools/time-zone-converter"
          element={<TimeZoneConverter />}
        />
        <Route path="/tools/unit-converter" element={<UnitConverter />} />

        {/* Lifestyle & Finance Tools */}
        <Route path="/tools/bmi-calculator" element={<BMICalculator />} />
        <Route path="/tools/budget-tracker" element={<BudgetTracker />} />
        <Route path="/tools/dice-roller" element={<DiceRoller />} />
        <Route path="/tools/invoice-generator" element={<InvoiceGenerator />} />
        <Route path="/tools/loan-calculator" element={<LoanCalculator />} />
        <Route path="/tools/market-rush" element={<MarketRush />} />
        <Route path="/tools/meal-planner" element={<MealPlanner />} />
        <Route path="/tools/stock-market-game" element={<StockMarketGame />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
