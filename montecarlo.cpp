#include <vector>
#include <iostream>
#include <random>
#include <cmath>
#include <mysql_driver.h>
#include <mysql_connection.h>
#include <cppconn/statement.h>
#include <cppconn/resultset.h>
#include <thread>

void runSimulations(size_t startSim, size_t endSim, size_t numDays, const std::vector<double>& stockReturns, double initialInvestment, std::vector<std::vector<double>>& results, std::mutex& resultsMutex) {
    std::default_random_engine generator(std::random_device{}());
    std::normal_distribution<double> distribution(0.0, 1.0);

    for(size_t sim = startSim; sim < endSim; ++sim) {
        std::vector<double> simulationResults;
        double investment = initialInvestment;
        for(size_t day = 0; day < numDays; ++day) {
            double randomFactor = distribution(generator);
            investment *= (1 + randomFactor * stockReturns[day % stockReturns.size()]);
            simulationResults.push_back(investment);
        }
        {
            std::lock_guard<std::mutex> lock(resultsMutex);
            results[sim] = simulationResults;
        }
    }
}

int main() {
    sql::mysql::MySQL_Driver* driver = sql::mysql::get_mysql_driver_instance();
    std::unique_ptr<sql::Connection> con(driver->connect("tcp://127.0.0.1:3306", "user", "password"));
    con->setSchema("your_database_name");

    // Fetch stock information
    std::unique_ptr<sql::Statement> stmt(con->createStatement());
    std::unique_ptr<sql::ResultSet> res(stmt->executeQuery("SELECT name, amount, color FROM stocks"));

    // Assuming 'amount' is the daily return rate of each stock
    std::vector<double> stockReturns; 

    // Process the results and prepare data for Monte Carlo simulation
    while (res->next()) {
        // Assuming 'amount' is the second column in your query
        stockReturns.push_back(res->getDouble("amount")); 
    }

    // Check if stockReturns is empty
    if(stockReturns.empty()) {
        std::cerr << "No stock data retrieved." << std::endl;
        return 1;
    }

    // Monte Carlo simulation parameters
    size_t numDays = 100; // Number of days to simulate
    size_t numSimulations = 1000; // Number of simulation iterations
    double initialInvestment = 10000; // Initial investment amount

    // Initialize random number generation
    std::default_random_engine generator;
    std::normal_distribution<double> distribution(0.0, 1.0);

    size_t numThreads = std::thread::hardware_concurrency(); // Get the number of supported threads
    std::vector<std::thread> threads(numThreads);

    // Determine how many simulations each thread should run
    size_t simsPerThread = numSimulations / numThreads;
    size_t extraSims = numSimulations % numThreads;

    std::vector<std::vector<double>> results(numSimulations);
    std::mutex resultsMutex;

    // Launch threads
    size_t startSim = 0;
    for(size_t i = 0; i < numThreads; ++i) {
        size_t endSim = startSim + simsPerThread + (i < extraSims ? 1 : 0);
        threads[i] = std::thread(runSimulations, startSim, endSim, numDays, std::ref(stockReturns), initialInvestment);
        startSim = endSim;
    }

    // Join threads
    for(auto& t : threads) {
        t.join();
    }

    // Output to CSV after all threads have joined
    std::ofstream outputFile("monte_carlo_simulation.csv");
    outputFile << "Simulation,Day,Value\n";
    for (size_t sim = 0; sim < results.size(); ++sim) {
        for (size_t day = 0; day < results[sim].size(); ++day) {
            outputFile << sim << "," << day << "," << results[sim][day] << "\n";
        }
    }
    outputFile.close();

    return 0;
}
